import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { type WorkerEnv } from './worker.ts';

const env: WorkerEnv = {
  CASE_LIMITER: { limit: async () => ({ success: true }) },
  VERDICT_LIMITER: { limit: async () => ({ success: true }) },
  ASSETS: { fetch: async () => new Response('frontend asset') },
};

void test('Worker exposes key availability without exposing keys', async () => {
  const result = await worker.fetch(
    new Request('https://court.test/api/config'),
    { ...env, JEV_KEY: 'secret-jev' },
  );
  assert.equal(result.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await result.json(), {
    judgeReady: true,
    generatorReady: true,
  });
});

void test('Worker routes verdict requests and reports missing configuration', async () => {
  const response = await worker.fetch(
    new Request('https://court.test/api/verdict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: 'practice',
        defense: 'The sign had no power.',
      }),
    }),
    env,
  );
  assert.equal(response.status, 503);
  assert.match(((await response.json()) as { error: string }).error, /JEV_KEY/);
});

void test('Worker rejects unsupported API methods and unknown routes', async () => {
  assert.equal(
    (await worker.fetch(new Request('https://court.test/api/verdict'), env))
      .status,
    405,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request('https://court.test/api/config', { method: 'POST' }),
        env,
      )
    ).status,
    405,
  );
  assert.equal(
    (await worker.fetch(new Request('https://court.test/api/unknown'), env))
      .status,
    404,
  );
});

void test('Worker serves the Vite frontend through its assets binding', async () => {
  const response = await worker.fetch(new Request('https://court.test/'), env);
  assert.equal(await response.text(), 'frontend asset');
});

void test('Worker rate limits both APIs before case or paid provider work', async () => {
  for (const path of ['case', 'verdict']) {
    const keys: string[] = [];
    const limiter = {
      limit: async ({ key }: { key: string }) => {
        keys.push(key);
        return { success: false };
      },
    };
    const response = await worker.fetch(
      new Request(`https://court.test/api/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CF-Connecting-IP': '192.0.2.45',
        },
        body: '{}',
      }),
      { ...env, CASE_LIMITER: limiter, VERDICT_LIMITER: limiter },
    );
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('Retry-After'), '60');
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(keys, ['192.0.2.45']);
  }
});

void test('Worker secures successful and error API responses', async () => {
  for (const path of ['config', 'unknown', 'verdict']) {
    const response = await worker.fetch(
      new Request(`https://court.test/api/${path}`),
      env,
    );
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
  }
});
