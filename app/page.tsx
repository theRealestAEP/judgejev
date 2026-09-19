import { Courtroom } from '@/components/courtroom';
import { courtEnv } from '@/server/env';
export const dynamic = 'force-dynamic';
export default function Home() {
  const env = courtEnv();
  return (
    <Courtroom
      config={{
        judgeReady: Boolean(env.TYPESAFE_API_KEY),
        generatorReady: Boolean(env.OPENAI_API_KEY && env.TYPESAFE_API_KEY),
      }}
    />
  );
}
