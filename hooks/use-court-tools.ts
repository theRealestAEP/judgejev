'use client';
import { useEffect, useRef } from 'react';
import type { CaseFile, VerdictResult } from '@/lib/game-types';

type Actions = {
  state: {
    case: CaseFile;
    caseNumber: number;
    defense: string;
    result: VerdictResult | null;
    busy: string | null;
    liveJudge: boolean;
    freshCases: boolean;
  };
  submitDefense: (defense: string) => Promise<VerdictResult>;
  nextCase: () => Promise<CaseFile>;
};
type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
};
type ContextDocument = Document & {
  modelContext?: {
    registerTool: (
      tool: Tool,
      options: { signal: AbortSignal },
    ) => void | Promise<void>;
  };
};

export function useCourtTools(actions: Actions) {
  const latest = useRef(actions);
  useEffect(() => {
    latest.current = actions;
  }, [actions]);
  useEffect(() => {
    const context = (document as ContextDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const emptyInput = {
      type: 'object',
      properties: {},
      additionalProperties: false,
    };
    const tools: Tool[] = [
      {
        name: 'read_court_case',
        title: 'Read the current case',
        description:
          'Read the accusation, all five exhibits, draft defense, and any revealed result.',
        inputSchema: emptyInput,
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute: () => latest.current.state,
      },
      {
        name: 'submit_court_defense',
        title: 'Submit a defense',
        description:
          'Submit the player’s defense for the current case and show the result. Practice mode reveals case notes without scoring.',
        inputSchema: {
          type: 'object',
          properties: {
            defense: { type: 'string', minLength: 1, maxLength: 1000 },
          },
          required: ['defense'],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        async execute(input) {
          if (
            !input ||
            typeof input !== 'object' ||
            !('defense' in input) ||
            typeof input.defense !== 'string'
          )
            throw new Error('Supply a defense string.');
          const result = await latest.current.submitDefense(input.defense);
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          );
          return result;
        },
      },
      {
        name: 'deal_court_case',
        title: 'Deal a fresh case',
        description:
          'Generate a fresh case, replace the current case and draft, and display five new exhibits. Requires a connected live court.',
        inputSchema: emptyInput,
        annotations: { readOnlyHint: false, untrustedContentHint: true },
        async execute() {
          const next = await latest.current.nextCase();
          await new Promise<void>((resolve) =>
            requestAnimationFrame(() => resolve()),
          );
          return next;
        },
      },
    ];
    for (const tool of tools) {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => {});
      } catch {
        /* The visible interface remains available when registration is unsupported. */
      }
    }
    return () => lifecycle.abort();
  }, []);
}
