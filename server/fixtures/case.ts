import type { PrivateCase } from '../game.ts';

export const fixtureCase: PrivateCase = {
  title: 'The midnight cake heist.',
  category: 'CRIMES AGAINST CAKE',
  accusation:
    'You stand accused of stealing the mayor’s seven-tier cake from the bakery at midnight.',
  evidence: [
    'A witness saw you leave the bakery at 12:05 a.m., carrying a suspiciously large cake box.',
    'The witness says the bakery’s glowing sign lit your face clearly enough to identify you.',
    'The power log shows a complete outage, including the sign, from 11:50 p.m. to 12:20 a.m.',
    'Pink frosting was found on your sleeve after you attended the town’s public cake tasting.',
    'Earlier that day, you argued with the mayor about the cake competition.',
  ],
  solution:
    'Exhibits B and C contradict each other: the witness relied on a glowing sign during a documented power outage. That weakens the identification. The frosting has an ordinary explanation in the public tasting, and an argument alone does not establish who took the cake.',
  rubric:
    'Accept identifying that the sign was off during the witness identification, or a coherent evidence-grounded argument that the identification and circumstantial evidence fail to link the defendant to the theft. Accept any clear paraphrase. An invented alibi, a bare denial, or merely naming frosting without explaining its relevance is insufficient.',
  sampleDefense:
    'The sign could not have lit my face because it was off at 12:05. The witness identification is unreliable, and the frosting came from the public tasting.',
};
