import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Courtroom } from '@/components/courtroom';
import type { CourtConfig } from '@/lib/game-types';
import './styles.css';

const root = createRoot(document.getElementById('root')!);

async function startCourt() {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) throw new Error('The local API server is unavailable.');
    const config = (await response.json()) as CourtConfig;
    root.render(
      <StrictMode>
        <Courtroom config={config} />
      </StrictMode>,
    );
  } catch {
    root.render(
      <main className="boot-error">
        <h1>The court is taking a recess.</h1>
        <p>
          The API server could not be reached. Start the app with{' '}
          <code>npm run dev</code>, then <a href="/">try again</a>.
        </p>
      </main>,
    );
  }
}

void startCourt();
