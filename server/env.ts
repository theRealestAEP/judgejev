import { env } from 'cloudflare:workers';
import type { CourtEnv } from './game';

export function courtEnv(): CourtEnv {
  const bindings = env as Record<string, unknown>;
  return {
    TYPESAFE_API_KEY:
      typeof bindings.TYPESAFE_API_KEY === 'string'
        ? bindings.TYPESAFE_API_KEY
        : process.env.TYPESAFE_API_KEY,
    OPENAI_API_KEY:
      typeof bindings.OPENAI_API_KEY === 'string'
        ? bindings.OPENAI_API_KEY
        : process.env.OPENAI_API_KEY,
    OPENAI_MODEL:
      typeof bindings.OPENAI_MODEL === 'string'
        ? bindings.OPENAI_MODEL
        : process.env.OPENAI_MODEL,
  };
}
