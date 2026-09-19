import { CourtError, dealCase, judgeDefense, type CourtEnv } from './game.ts';

// A bounded per-isolate burst guard. Hosted access is owner-private; configure
// platform-wide quotas before broadening access to a public audience.
const requests = new Map<string, { count: number; until: number }>();

export async function courtRequest(
  request: Request,
  action: 'case' | 'verdict',
  env: CourtEnv,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  try {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin)
      throw new CourtError('Please submit from the courtroom.', 403);
    if (!request.headers.get('content-type')?.includes('application/json'))
      throw new CourtError('Send a JSON request.', 415);
    const ip = request.headers.get('cf-connecting-ip') || 'local';
    const key = `${ip}:${action}`;
    const now = Date.now();
    for (const [id, item] of requests)
      if (item.until <= now) requests.delete(id);
    let window = requests.get(key);
    if (!window) {
      if (requests.size >= 5000)
        throw new CourtError(
          'The court is busy. Please try again shortly.',
          429,
        );
      window = { count: 0, until: now + 60000 };
      requests.set(key, window);
    }
    window.count++;
    if (window.count > (action === 'case' ? 8 : 20))
      throw new CourtError(
        'A moment of order, please. Try again in a minute.',
        429,
      );
    const reader = request.body?.getReader();
    if (!reader) throw new CourtError('Send a JSON request.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 30000) {
        await reader.cancel();
        throw new CourtError('This request is too large.', 413);
      }
      chunks.push(chunk.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    let body;
    try {
      body = JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new CourtError('Send a valid JSON request.', 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body))
      throw new CourtError('Send a valid request.', 400);
    let result;
    if (action === 'case') {
      const recent = body.recentTitles ?? [];
      if (
        !Array.isArray(recent) ||
        recent.length > 12 ||
        recent.some((t) => typeof t !== 'string' || t.length > 80)
      )
        throw new CourtError('The recent case list is invalid.', 400);
      result = await dealCase(env, recent, fetcher);
    } else {
      result = await judgeDefense(body.token, body.defense, env, fetcher);
    }
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const known = error instanceof CourtError;
    return Response.json(
      {
        error: known
          ? error.message
          : 'The court hit a snag. Your defense is safe; please try again.',
      },
      {
        status: known ? error.status : 500,
        headers: {
          'Cache-Control': 'no-store',
          ...(known && error.status === 429 ? { 'Retry-After': '60' } : {}),
        },
      },
    );
  }
}
