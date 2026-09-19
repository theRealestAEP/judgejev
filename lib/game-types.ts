export type CaseFile = {
  title: string;
  category: string;
  accusation: string;
  evidence: string[];
};
export type CaseDelivery = {
  case: CaseFile;
  token: string;
  generated: boolean;
};
export type VerdictResult = {
  verdict: 'guilty' | 'not_guilty' | null;
  notes: string;
  source: 'jev' | 'practice';
};
export type CourtConfig = { judgeReady: boolean; generatorReady: boolean };
