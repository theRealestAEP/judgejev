import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Gavel,
  HelpCircle,
  LoaderCircle,
  RotateCcw,
  Scale,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Judge } from '@/components/judge';
import { useCourtAudio } from '@/hooks/use-court-audio';
import type {
  CaseDelivery,
  CourtConfig,
  VerdictResult,
} from '@/lib/game-types';

const ROUND_SECONDS = 180;
const DELIBERATION_MS = 2000;
const GAVEL_SEQUENCE_MS = 800;
const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export function Courtroom({ config }: { config: CourtConfig }) {
  const [current, setCurrent] = useState<CaseDelivery | null>(null);
  const [defense, setDefense] = useState('');
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [busy, setBusy] = useState<'case' | 'verdict' | null>(null);
  const [error, setError] = useState('');
  const [ruling, setRuling] = useState(false);
  const mounted = useRef(true);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const timeoutSubmitted = useRef(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [caseNumber, setCaseNumber] = useState(0);
  const [recentTitles, setRecentTitles] = useState<string[]>([]);
  const inFlight = useRef(false);
  const requestController = useRef<AbortController | null>(null);
  const caseHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLDivElement>(null);
  const defenseField = useRef<HTMLTextAreaElement>(null);
  const { startAudio, toggleAudio, audioPlaying, playSound } = useCourtAudio();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestController.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (result) resultHeading.current?.focus();
  }, [result]);
  useEffect(() => {
    if (caseNumber > 0) caseHeading.current?.focus();
  }, [caseNumber]);

  const request = useCallback(
    async <T,>(path: string, body: unknown): Promise<T> => {
      const controller = new AbortController();
      requestController.current = controller;
      const timeout = setTimeout(() => controller.abort(), 115000);
      try {
        const response = await fetch(path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            (data as { error?: string }).error ||
              'The court hit a snag. Please try again.',
          );
        return data as T;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError')
          throw new Error(
            'The court took too long. Your defense is saved here; please retry.',
          );
        if (err instanceof TypeError)
          throw new Error(
            'The court could not be reached. Your defense is saved here; please retry.',
          );
        throw err;
      } finally {
        clearTimeout(timeout);
        requestController.current = null;
      }
    },
    [],
  );

  const submitDefense = useCallback(
    async (text: string) => {
      if (!current) throw new Error('Deal a case first.');
      if (inFlight.current)
        throw new Error('The court is already considering a request.');
      if (result)
        throw new Error(
          'This case already has a result. Deal another case to continue.',
        );
      if (!text.trim() || text.length > 1000)
        throw new Error('Write a defense between 1 and 1,000 characters.');
      inFlight.current = true;
      setBusy('verdict');
      setRuling(false);
      const started = performance.now();
      setError('');
      setDefense(text);
      try {
        const verdict = await request<VerdictResult>('/api/verdict', {
          token: current.token,
          defense: text,
        });
        await pause(
          Math.max(0, DELIBERATION_MS - (performance.now() - started)),
        );
        if (!mounted.current) return verdict;
        setRuling(true);
        playSound('gavel');
        await pause(GAVEL_SEQUENCE_MS);
        if (!mounted.current) return verdict;
        setRuling(false);
        setResult(verdict);
        playSound('stamp');
        return verdict;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'The court hit a snag. Please try again.',
        );
        throw err;
      } finally {
        inFlight.current = false;
        setBusy(null);
      }
    },
    [current, request, result, playSound],
  );

  useEffect(() => {
    if (!deadline || result || busy === 'verdict') return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0 && !inFlight.current && !timeoutSubmitted.current) {
        timeoutSubmitted.current = true;
        void submitDefense(
          defense.trim()
            ? defense
            : `[No defense submitted within ${ROUND_SECONDS} seconds.]`,
        ).catch(() => {});
      }
    };
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [deadline, result, busy, defense, submitDefense]);

  const nextCase = useCallback(async () => {
    if (inFlight.current) throw new Error('The clerk is already working.');
    if (!config.generatorReady)
      throw new Error(
        'Fresh cases are available once the live court is connected.',
      );
    setGameStarted(true);
    startAudio();
    inFlight.current = true;
    setBusy('case');
    setError('');
    try {
      const delivered = await request<CaseDelivery>('/api/case', {
        recentTitles,
      });
      setCurrent(delivered);
      setDeadline(Date.now() + ROUND_SECONDS * 1000);
      setSecondsLeft(ROUND_SECONDS);
      timeoutSubmitted.current = false;
      setDefense('');
      setResult(null);
      setCaseNumber((n) => n + 1);
      setRecentTitles((titles) => [...titles, delivered.case.title].slice(-12));
      return delivered.case;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'The clerk hit a snag. Please try again.',
      );
      throw err;
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  }, [config.generatorReady, recentTitles, request, startAudio]);

  const caption =
    busy === 'verdict'
      ? ruling
        ? '“Order. The court has reached a verdict.”'
        : '“A moment. I’m judging.”'
      : busy === 'case'
        ? '“Clerk, bring the next case.”'
        : result?.verdict === 'not_guilty'
          ? '“There is reasonable doubt. You’re free to go.”'
          : result?.verdict === 'guilty'
            ? '“The evidence supports the charge.”'
            : '“Go on. This ought to be good.”';
  const verdictLabel = result?.verdict === 'guilty' ? 'GUILTY' : 'NOT GUILTY';

  return (
    <main className={`game-shell ${current && !result ? 'round-active' : ''}`}>
      <header className="masthead">
        <div className="wordmark">
          <div className="wordmark-icon">
            <Gavel size={26} />
          </div>
          <div>
            <h1>
              JUDGE <span>JEV</span>
            </h1>
            <p>THE COURT OF QUESTIONABLE CIRCUMSTANCES</p>
          </div>
        </div>
        <div className="header-right">
          {gameStarted && (
            <button
              className="rules-button"
              onClick={toggleAudio}
              aria-label={audioPlaying ? 'Mute audio' : 'Unmute audio'}
              title={audioPlaying ? 'Mute audio' : 'Unmute audio'}
            >
              {audioPlaying ? <Volume2 /> : <VolumeX />}
              {audioPlaying ? 'Mute' : 'Unmute'}
            </button>
          )}
          <button
            className="rules-button"
            onClick={() => setRulesOpen(!rulesOpen)}
            aria-expanded={rulesOpen}
            aria-controls="court-rules"
          >
            <HelpCircle /> How to play
          </button>
        </div>
      </header>
      {rulesOpen && (
        <section id="court-rules" className="rules-panel">
          <h2>Read the evidence. Raise reasonable doubt.</h2>
          <p>
            Each round draws from 50 criminal stories and presents five
            exhibits, starting with what happened. Some cases are strongly
            supported; others contain conflicting accounts or uncertain links.
            Your goal is to raise reasonable doubt. Explain how a weakness
            affects the whole case, and address the evidence against you.
          </p>
          <p>
            The Mostly Honorable Judge Jev weighs the full record and your
            response, then decides GUILTY or NOT GUILTY. Jev may find reasonable
            doubt in the evidence even if your response adds little. A
            persuasive defense must still stand up to the facts.
          </p>
          <p>
            You have three minutes once the case appears. At zero, your current
            response is submitted automatically.
          </p>
          <p>
            Powered by Jev from{' '}
            <a href="https://typesafe.ai/" target="_blank" rel="noreferrer">
              TypeSafe AI
            </a>
            . Jev judges the record and returns the verdict probabilities.
          </p>
        </section>
      )}
      <div className="docket-bar">
        <span>
          THE DOCKET{' '}
          <strong>/ CASE {String(caseNumber).padStart(3, '0')}</strong>
        </span>
        <span>
          THE ENDLESS DOCKET <span aria-hidden="true">✦</span>
        </span>
      </div>
      <div className="court-layout">
        <aside className="court-column">
          <div className="court-stage">
            <div className="court-ribbon">THE MOSTLY HONORABLE JUDGE JEV</div>
            <Judge
              state={
                busy === 'verdict'
                  ? ruling
                    ? 'ruling'
                    : 'deliberating'
                  : result?.verdict
                    ? 'verdict'
                    : 'reading'
              }
            />
            <div className="court-caption">
              <span className="eyebrow">
                {busy
                  ? 'A LITTLE ORDER, PLEASE'
                  : result?.verdict
                    ? 'THE COURT HAS SPOKEN'
                    : 'THE COURT IS LISTENING'}
              </span>
              <p>{caption}</p>
            </div>
          </div>
          <div className="judge-note">
            <Sparkles />
            <p>
              <strong>Weigh every exhibit.</strong>
              <br />
              Connect the facts and make your case.
            </p>
          </div>
          {current && !result && (
            <button
              className="deal-button"
              disabled={Boolean(busy)}
              onClick={() => void nextCase().catch(() => {})}
            >
              {busy === 'case' ? (
                <LoaderCircle className="loading-icon" />
              ) : (
                <RotateCcw />
              )}{' '}
              {busy === 'case'
                ? 'Preparing a fresh case…'
                : 'Deal a fresh case'}
              <ArrowRight />
            </button>
          )}
        </aside>
        <section
          className="case-paper"
          aria-label="Current case"
          aria-busy={Boolean(busy)}
        >
          {current ? (
            <>
              <div className="paper-top">
                <span className="case-label">THE PEOPLE v. YOU</span>
                <span className="case-tag">EXHIBIT A–E</span>
              </div>
              <h2 ref={caseHeading} tabIndex={-1}>
                {current.case.title}
              </h2>
              <p className="accusation">{current.case.accusation}</p>
              <div className="evidence-heading">
                <Scale size={17} /> THE EVIDENCE <span>READ CAREFULLY</span>
              </div>
              <ol className="evidence-list">
                {current.case.evidence.map((item, i) => {
                  const sourceEnd = item.indexOf(': ');
                  const finding = item.slice(sourceEnd + 2);
                  return (
                    <li key={`${caseNumber}-${i}`}>
                      <span
                        className="exhibit"
                        aria-label={`Exhibit ${String.fromCharCode(65 + i)}`}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <p>
                        <strong className="evidence-source">
                          {item.slice(0, sourceEnd)}
                        </strong>
                        {finding.charAt(0).toUpperCase() + finding.slice(1)}
                      </p>
                    </li>
                  );
                })}
              </ol>
              <form
                className="defense-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submitDefense(defense).catch(() => {});
                }}
              >
                <div className="defense-label">
                  <label htmlFor="defense">Your side of the story.</label>
                  <span id="defense-count">{defense.length} / 1000</span>
                </div>
                <textarea
                  ref={defenseField}
                  id="defense"
                  className="defense-input"
                  value={defense}
                  onChange={(e) => {
                    if (deadline && Date.now() < deadline)
                      setDefense(e.target.value);
                  }}
                  maxLength={1000}
                  aria-describedby="defense-count"
                  readOnly={Boolean(result || busy) || secondsLeft === 0}
                  placeholder="Your Honor, the evidence shows…"
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      (e.metaKey || e.ctrlKey) &&
                      !result &&
                      !busy &&
                      defense.trim()
                    ) {
                      e.preventDefault();
                      void submitDefense(defense).catch(() => {});
                    }
                  }}
                />
                {!result && (
                  <div className="submit-row">
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={
                        Boolean(busy) || !defense.trim() || !config.judgeReady
                      }
                    >
                      {busy === 'verdict' ? (
                        <LoaderCircle className="loading-icon" />
                      ) : (
                        <Gavel />
                      )}
                      {busy === 'verdict'
                        ? ruling
                          ? 'The verdict is in…'
                          : 'Jev is deliberating…'
                        : secondsLeft === 0
                          ? 'Retry verdict'
                          : 'Plead your case'}
                      {!busy && <ArrowRight />}
                    </button>
                    <span className="submit-hint">
                      FIVE EXHIBITS.
                      <br />
                      ONE DEFENSE.
                    </span>
                  </div>
                )}
              </form>
              {result && (
                <section className="verdict-panel" aria-label="Case result">
                  <div
                    ref={resultHeading}
                    tabIndex={-1}
                    className={`verdict-stamp ${result.verdict}`}
                  >
                    {verdictLabel}
                  </div>
                  <div className="eyebrow">JEV’S VERDICT PROBABILITIES</div>
                  <div className="probability-grid">
                    {(['guilty', 'not_guilty'] as const).map((outcome) => (
                      <div className={`probability ${outcome}`} key={outcome}>
                        <span>
                          {outcome === 'guilty' ? 'Guilty' : 'Not guilty'}
                        </span>
                        <strong>
                          {(result.probabilities[outcome] * 100).toFixed(2)}%
                        </strong>
                        <meter
                          min={0}
                          max={1}
                          value={result.probabilities[outcome]}
                          aria-label={`${outcome === 'guilty' ? 'Guilty' : 'Not guilty'} probability`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="next-button"
                    disabled={Boolean(busy)}
                    onClick={() => void nextCase().catch(() => {})}
                  >
                    {busy === 'case' ? (
                      <LoaderCircle className="loading-icon" />
                    ) : (
                      <Sparkles />
                    )}
                    {busy === 'case'
                      ? 'Preparing your next case…'
                      : 'Next case'}
                    <ArrowRight />
                  </button>
                </section>
              )}
            </>
          ) : (
            <div className="court-welcome">
              <span className="case-label">THE ENDLESS DOCKET</span>
              <h2>
                A fresh case.
                <br />
                Your best defense.
              </h2>
              <p>
                Five exhibits. One accusation. You have three minutes to plead
                your case to Judge Jev.
              </p>
              <button
                className="next-button"
                disabled={Boolean(busy) || !config.generatorReady}
                onClick={() => void nextCase().catch(() => {})}
              >
                {busy === 'case' ? (
                  <LoaderCircle className="loading-icon" />
                ) : (
                  <Sparkles />
                )}
                {busy === 'case' ? 'Preparing your case…' : 'Play'}
                <ArrowRight />
              </button>
              {!config.generatorReady && (
                <p className="setup-strip">Connect Jev to open the court.</p>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          {busy === 'case' && (
            <p className="load-status">
              The clerk is assembling the next case.
            </p>
          )}
        </section>
      </div>
      <output className="sr-only" aria-live="polite" aria-atomic="true">
        {busy === 'case'
          ? 'Preparing a new case.'
          : busy === 'verdict'
            ? ruling
              ? 'The court has reached a verdict.'
              : 'Considering your defense.'
            : secondsLeft === 0 && !result
              ? 'Time is up. Your defense is locked for submission.'
              : result
                ? `${verdictLabel}. Guilty probability ${(result.probabilities.guilty * 100).toFixed(2)} percent. Not guilty probability ${(result.probabilities.not_guilty * 100).toFixed(2)} percent.`
                : current
                  ? `Case ${caseNumber}. ${current.case.title}`
                  : 'Deal your first case.'}
      </output>
      {current && !result && (
        <section
          className={`countdown-bar ${secondsLeft <= 30 ? 'urgent' : ''}`}
          aria-label="Round countdown"
        >
          <div className="countdown-inner">
            <div className="countdown-label">
              <span>
                <Timer size={20} aria-hidden="true" />
                {busy === 'verdict'
                  ? ruling
                    ? 'THE VERDICT IS IN'
                    : 'JEV IS DELIBERATING'
                  : secondsLeft === 0
                    ? 'TIME IS UP'
                    : 'TIME TO MAKE YOUR CASE'}
              </span>
              <strong
                role="timer"
                aria-label={`${secondsLeft} seconds remaining`}
              >
                {Math.floor(secondsLeft / 60)}:
                {String(secondsLeft % 60).padStart(2, '0')}
              </strong>
            </div>
            <progress
              className="countdown-track"
              aria-label="Time remaining"
              max={ROUND_SECONDS}
              value={secondsLeft}
              aria-valuetext={`${secondsLeft} seconds remaining`}
            />
          </div>
        </section>
      )}
      <footer className="game-footer">
        <span>ALL SHAPES ARE INNOCENT UNTIL PROVEN GUILTY.</span>
        <span className="footer-credit">
          SMALL COURT. BIG JUDGMENT. ✦
          <a
            className="footer-repo"
            href="https://github.com/theRealestAEP/judgejev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Judge Jev on GitHub"
            title="View source on GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .297a12 12 0 0 0-3.793 23.385c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 6.006 0c2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
            </svg>
          </a>
        </span>
      </footer>
    </main>
  );
}
