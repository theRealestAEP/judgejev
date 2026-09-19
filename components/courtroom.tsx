'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Gavel,
  HelpCircle,
  LoaderCircle,
  RotateCcw,
  Scale,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Judge } from '@/components/judge';
import { useCourtTools } from '@/hooks/use-court-tools';
import { practiceCase } from '@/lib/practice-case';
import type {
  CaseDelivery,
  CourtConfig,
  VerdictResult,
} from '@/lib/game-types';

export function Courtroom({ config }: { config: CourtConfig }) {
  const [current, setCurrent] = useState<CaseDelivery>({
    case: practiceCase,
    token: 'practice',
    generated: false,
  });
  const [defense, setDefense] = useState('');
  const [result, setResult] = useState<VerdictResult | null>(null);
  const [busy, setBusy] = useState<'case' | 'verdict' | null>(null);
  const [error, setError] = useState('');
  const [rulesOpen, setRulesOpen] = useState(false);
  const [caseNumber, setCaseNumber] = useState(1);
  const [recentTitles, setRecentTitles] = useState([practiceCase.title]);
  const inFlight = useRef(false);
  const requestController = useRef<AbortController | null>(null);
  const caseHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLDivElement>(null);
  const defenseField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => requestController.current?.abort(), []);
  useEffect(() => {
    if (result) resultHeading.current?.focus();
  }, [result]);
  useEffect(() => {
    if (caseNumber > 1) caseHeading.current?.focus();
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
      setError('');
      setDefense(text);
      try {
        const verdict = await request<VerdictResult>('/api/verdict', {
          token: current.token,
          defense: text,
        });
        setResult(verdict);
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
    [current.token, request, result],
  );

  const nextCase = useCallback(async () => {
    if (inFlight.current) throw new Error('The clerk is already working.');
    if (!config.generatorReady)
      throw new Error(
        'Fresh cases are available once the live court is connected.',
      );
    inFlight.current = true;
    setBusy('case');
    setError('');
    try {
      const delivered = await request<CaseDelivery>('/api/case', {
        recentTitles,
      });
      setCurrent(delivered);
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
  }, [config.generatorReady, recentTitles, request]);

  useCourtTools({
    state: {
      case: current.case,
      caseNumber,
      defense,
      result,
      busy,
      liveJudge: config.judgeReady,
      freshCases: config.generatorReady,
    },
    submitDefense,
    nextCase,
  });

  function resetPractice() {
    setResult(null);
    setDefense('');
    setError('');
    defenseField.current?.focus();
  }
  const caption =
    busy === 'verdict'
      ? '“A moment. I’m judging.”'
      : busy === 'case'
        ? '“Clerk! Bring me something peculiar.”'
        : result?.verdict === 'not_guilty'
          ? '“A fair point. You’re free to go.”'
          : result?.verdict === 'guilty'
            ? '“The court remains unconvinced.”'
            : result
              ? '“Now, about that glowing sign…”'
              : '“Go on. This ought to be good.”';
  const verdictLabel =
    result?.verdict === 'guilty'
      ? 'GUILTY'
      : result?.verdict === 'not_guilty'
        ? 'NOT GUILTY'
        : 'CASE NOTES';

  return (
    <main className="game-shell">
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
          <span className="session-label">
            <i className="status-dot" />{' '}
            {config.judgeReady ? 'COURT IS IN SESSION' : 'PRACTICE COURT'}
          </span>
          <Button
            className="rules-button"
            onClick={() => setRulesOpen(!rulesOpen)}
            aria-expanded={rulesOpen}
            aria-controls="court-rules"
          >
            <HelpCircle /> How to play
          </Button>
        </div>
      </header>
      {rulesOpen && (
        <section id="court-rules" className="rules-panel">
          <h2>A little doubt goes a long way.</h2>
          <p>
            Read the five exhibits. Find a contradiction or build an explanation
            using the evidence. Write your defense, then let Jev decide. A
            material flaw or a sound alternative earns NOT GUILTY. A bare denial
            or an invented alibi earns GUILTY. Take your time—this court can
            wait.
          </p>
          {!config.judgeReady && (
            <p className="practice-explanation">
              You’re in practice court. You can write a defense and reveal the
              case notes. Live verdicts and fresh cases become available when
              the court’s API keys are connected.
            </p>
          )}
        </section>
      )}
      <div className="docket-bar">
        <span>
          THE DOCKET{' '}
          <strong>/ CASE {String(caseNumber).padStart(3, '0')}</strong>
        </span>
        <span>
          {current.generated ? 'THE ENDLESS DOCKET' : 'THE OPENING CASE'}{' '}
          <span aria-hidden="true">✦</span>
        </span>
      </div>
      <div className="court-layout">
        <aside className="court-column">
          <div className="court-stage">
            <div className="court-ribbon">THE HONORABLE (MOSTLY) JUDGE JEV</div>
            <Judge
              state={
                busy === 'verdict'
                  ? 'deliberating'
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
              <strong>Something doesn’t add up.</strong>
              <br />
              The evidence tells a story. Your job is to find the hole in it.
            </p>
          </div>
          {config.generatorReady && !result && (
            <Button
              className="deal-button"
              disabled={Boolean(busy)}
              onClick={() => void nextCase().catch(() => {})}
            >
              {busy === 'case' ? (
                <LoaderCircle className="loading-icon" />
              ) : (
                <RotateCcw />
              )}{' '}
              {busy === 'case' ? 'Writing a fresh case…' : 'Deal a fresh case'}
              <ArrowRight />
            </Button>
          )}
        </aside>
        <section
          className="case-paper"
          aria-label="Current case"
          aria-busy={Boolean(busy)}
        >
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
            {current.case.evidence.map((item, i) => (
              <li key={`${caseNumber}-${i}`}>
                <span
                  className="exhibit"
                  aria-label={`Exhibit ${String.fromCharCode(65 + i)}`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <p>{item}</p>
              </li>
            ))}
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
            <Textarea
              ref={defenseField}
              id="defense"
              className="defense-input"
              value={defense}
              onChange={(e) => setDefense(e.target.value)}
              maxLength={1000}
              aria-describedby="defense-count"
              readOnly={Boolean(result || busy)}
              placeholder="Your Honor, there’s a small problem with this evidence…"
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
                <Button
                  type="submit"
                  className="submit-button"
                  disabled={Boolean(busy) || !defense.trim()}
                >
                  {busy === 'verdict' ? (
                    <LoaderCircle className="loading-icon" />
                  ) : (
                    <Gavel />
                  )}
                  {busy === 'verdict'
                    ? config.judgeReady
                      ? 'Jev is deliberating…'
                      : 'Opening case notes…'
                    : config.judgeReady
                      ? 'Plead your case'
                      : 'Review practice case'}
                  {!busy && <ArrowRight />}
                </Button>
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
                className={`verdict-stamp ${result.verdict || 'practice'}`}
              >
                {verdictLabel}
              </div>
              <div className="eyebrow">
                {result.source === 'jev'
                  ? 'DECIDED BY JEV · CASE WRITER’S NOTES'
                  : 'PRACTICE REVEAL · YOUR DEFENSE WAS NOT SCORED'}
              </div>
              <p>{result.notes}</p>
              {config.generatorReady ? (
                <Button
                  className="next-button"
                  disabled={Boolean(busy)}
                  onClick={() => void nextCase().catch(() => {})}
                >
                  {busy === 'case' ? (
                    <LoaderCircle className="loading-icon" />
                  ) : (
                    <Sparkles />
                  )}
                  {busy === 'case' ? 'Preparing your next case…' : 'Next case'}
                  <ArrowRight />
                </Button>
              ) : (
                <Button className="next-button" onClick={resetPractice}>
                  <RotateCcw /> Try the opening case again
                </Button>
              )}
            </section>
          )}
          {error && (
            <p role="alert" className="error-message">
              {error}
            </p>
          )}
          {busy === 'case' && (
            <p className="load-status">
              The clerk is writing five exhibits. Jev will check the case before
              it reaches you.
            </p>
          )}
          {(!config.judgeReady || !config.generatorReady) && (
            <div className="setup-strip">
              {config.judgeReady
                ? 'Jev is connected. Fresh cases need the case writer’s API key.'
                : 'Practice mode · Connect the live court for Jev’s verdicts and endless new cases.'}
            </div>
          )}
        </section>
      </div>
      <output className="sr-only" aria-live="polite" aria-atomic="true">
        {busy === 'case'
          ? 'Preparing a new case.'
          : busy === 'verdict'
            ? 'Considering your defense.'
            : result
              ? `${verdictLabel}. ${result.notes}`
              : `Case ${caseNumber}. ${current.case.title}`}
      </output>
      <footer className="game-footer">
        <span>ALL SHAPES ARE INNOCENT UNTIL PROVEN GUILTY.</span>
        <span>SMALL COURT. BIG JUDGMENT. ✦</span>
      </footer>
    </main>
  );
}
