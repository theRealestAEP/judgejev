export type CaseFile = {
  title: string;
  category: string;
  accusation: string;
  evidence: string[];
};
export type CaseDelivery = {
  case: CaseFile;
  token: string;
};
export type VerdictResult = {
  verdict: 'guilty' | 'not_guilty';
  probabilities: { guilty: number; not_guilty: number };
};
export type CourtConfig = { judgeReady: boolean; generatorReady: boolean };
