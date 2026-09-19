import { courtEnv } from '@/server/env';
import { courtRequest } from '@/server/http';
export function POST(request: Request) {
  return courtRequest(request, 'verdict', courtEnv());
}
