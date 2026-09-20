import { courtRequest } from './http.ts';
import type { CourtEnv } from './game.ts';

type RateLimiter = {
  limit(input: { key: string }): Promise<{ success: boolean }>;
};

export type WorkerEnv = CourtEnv & {
  CASE_LIMITER: RateLimiter;
  VERDICT_LIMITER: RateLimiter;
  ASSETS: { fetch(request: Request): Promise<Response> };
};

async function handleRequest(
  request: Request,
  env: WorkerEnv,
): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (path === '/api/config') {
    if (request.method !== 'GET')
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET' },
      });
    return Response.json(
      {
        judgeReady: Boolean(env.JEV_KEY),
        generatorReady: Boolean(env.JEV_KEY),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }
  if (path === '/api/case' || path === '/api/verdict') {
    if (request.method !== 'POST')
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'POST' },
      });
    const limiter =
      path === '/api/case' ? env.CASE_LIMITER : env.VERDICT_LIMITER;
    const { success } = await limiter.limit({
      key: request.headers.get('cf-connecting-ip') || 'local',
    });
    if (!success)
      return Response.json(
        { error: 'A moment of order, please. Try again in a minute.' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    return courtRequest(
      request,
      path === '/api/case' ? 'case' : 'verdict',
      env,
    );
  }
  if (path.startsWith('/api/'))
    return Response.json({ error: 'Unknown court endpoint.' }, { status: 404 });
  return env.ASSETS.fetch(request);
}

const worker = {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const response = await handleRequest(request, env);
    if (!new URL(request.url).pathname.startsWith('/api/')) return response;
    const secured = new Response(response.body, response);
    secured.headers.set('Cache-Control', 'no-store');
    secured.headers.set('X-Content-Type-Options', 'nosniff');
    secured.headers.set('X-Frame-Options', 'DENY');
    return secured;
  },
};

export default worker;
