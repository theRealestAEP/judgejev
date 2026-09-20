import {
  catalogKinds,
  catalogTitles,
  catalogFamily,
  isCatalogKind,
  createCatalog,
  validateCatalog,
  renderCatalog,
  type CatalogDetails,
} from './catalog-rules.ts';
import {
  additionalKinds,
  createAdditional,
  validateAdditional,
  renderAdditional,
  type AdditionalDetails,
} from './additional-scenarios.ts';
import type { PrivateCase } from './game.ts';

export const caseKinds = [
  'clock',
  'travel',
  'visibility',
  'access',
  'ledger',
  'vehicle',
  'custody',
  'revision',
  ...additionalKinds,
  ...catalogKinds,
] as const;
export type CaseKind = (typeof caseKinds)[number];
export type CaseMode = 'flawed' | 'consistent';

type Details =
  | AdditionalDetails
  | CatalogDetails
  | {
      kind: 'clock';
      theftStart: number;
      theftEnd: number;
      displayed: number;
      fastBy: number;
    }
  | {
      kind: 'travel';
      seen: number;
      theftStart: number;
      theftEnd: number;
      minimumJourney: number;
    }
  | {
      kind: 'visibility';
      identified: number;
      outageStart: number;
      outageEnd: number;
    }
  | {
      kind: 'access';
      account: string;
      users: number;
      transfer: number;
      at: number;
      revokedAt: number;
    }
  | {
      kind: 'ledger';
      payment: number;
      transactions: number;
      claimedTotal: number;
      bankTotal: number;
      transactionId: string;
      secondTransactionId: string;
    }
  | {
      kind: 'vehicle';
      suspectPlate: string;
      recordedPlate: string;
      at: number;
      color: string;
      plateChangedAt: number;
    }
  | {
      kind: 'custody';
      recoveredSeal: string;
      testedSeal: string;
      intermediateSeal: string;
      labSourceSeal: string;
      labReading: number;
    }
  | {
      kind: 'revision';
      originalVersion: number;
      signedVersion: number;
      citedVersion: number;
      signedAt: number;
      feeRemovedAt: number;
      citedAt: number;
      fee: number;
    };
export type Scenario = Details & {
  seed: number;
  mode: CaseMode;
  site: string;
  day: string;
  reference: number;
};

const titles: Record<CaseKind, string> = {
  ...catalogTitles,
  clock: 'After-hours theft',
  travel: 'Archive burglary',
  visibility: 'Loading-bay arson',
  access: 'Unauthorized transfer',
  ledger: 'Missing funds',
  vehicle: 'Vehicle identification',
  custody: 'The recovered sample',
  revision: 'The disputed contract',
  trace_age: 'The drawer print',
  door_event: 'Restricted access',
  mass: 'The short shipment',
  dimensions: 'The service hatch',
  temperature: 'Cold storage',
  speed: 'The measured journey',
  control_sample: 'The laboratory control',
  notice: 'The access order',
  spending: 'The purchase approvals',
  network: 'The external upload',
  sightline: 'The courtyard witness',
  invoice: 'The disputed invoice',
  cure_age: 'The specimen test',
  backup: 'The deleted project',
  concentration: 'The stored mixture',
  delivery: 'The outbound file',
};
const sites = [
  'Northgate',
  'Westhaven',
  'Riverside',
  'Eastwick',
  'Fairmont',
  'Hillcrest',
  'Brookfield',
  'Ashford',
  'Oakridge',
  'Stonebridge',
  'Kingswell',
  'Southbank',
];

// A seed reproduces the facts and exhibit order for a case under this generator version.
function random(seed: number) {
  let state = seed >>> 0;
  return (min: number, max: number) => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const fraction = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    return min + Math.floor(fraction * (max - min + 1));
  };
}
const time = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

export function createScenario(
  kind: CaseKind,
  seed: number,
  requestedMode?: CaseMode,
): Scenario {
  const roll = random(seed);
  const drawnMode = roll(0, 1) === 0 ? 'flawed' : 'consistent';
  const mode = requestedMode ?? drawnMode;
  const flawed = mode === 'flawed';
  const common = {
    seed,
    mode,
    site: sites[roll(0, sites.length - 1)],
    day: `${roll(1, 28)} ${['January', 'March', 'May', 'July', 'September', 'November'][roll(0, 5)]}`,
    reference: roll(1000, 9999),
  };
  const at = roll(10 * 60, 21 * 60);
  if (isCatalogKind(kind))
    return { ...common, ...createCatalog(kind, roll, at, flawed) };
  switch (kind) {
    case 'clock': {
      const fastBy = roll(8, 25);
      const duringTheft = at + roll(1, 3);
      return {
        ...common,
        kind,
        theftStart: at,
        theftEnd: at + 4,
        displayed: flawed ? duringTheft : duringTheft + fastBy,
        fastBy,
      };
    }
    case 'travel': {
      const minimumJourney = roll(18, 35);
      const gap = flawed ? roll(4, 9) : minimumJourney + roll(2, 12);
      return {
        ...common,
        kind,
        seen: at - gap,
        theftStart: at,
        theftEnd: at + 3,
        minimumJourney,
      };
    }
    case 'visibility': {
      const outageStart = at - roll(20, 40);
      const outageEnd = flawed ? at + roll(2, 12) : at - roll(2, 12);
      return { ...common, kind, identified: at, outageStart, outageEnd };
    }
    case 'access': {
      const offset = roll(5, 25);
      return {
        ...common,
        kind,
        account: `PAY-${roll(100, 999)}`,
        users: roll(3, 12),
        transfer: roll(12, 98) * 100,
        at,
        revokedAt: at + (flawed ? offset : -offset),
      };
    }
    case 'ledger': {
      const payment = roll(12, 99) * 50;
      const transactions = roll(3, 8);
      const id = roll(10000, 89999);
      return {
        ...common,
        kind,
        payment,
        transactions,
        bankTotal: payment * (transactions + (flawed ? 0 : 1)),
        claimedTotal: payment * (transactions + 1),
        transactionId: `TX-${id}`,
        secondTransactionId: `TX-${id + (flawed ? 0 : 1)}`,
      };
    }
    case 'vehicle': {
      const suffix = roll(100, 899);
      const prefix = ['KLM', 'RVT', 'NDP', 'BXS'][roll(0, 3)];
      const offset = roll(5, 25);
      return {
        ...common,
        kind,
        suspectPlate: `${prefix}-${suffix + roll(1, 9)}`,
        recordedPlate: `${prefix}-${suffix}`,
        at,
        color: ['silver', 'white', 'blue', 'black'][roll(0, 3)],
        plateChangedAt: at + (flawed ? -offset : offset),
      };
    }
    case 'custody': {
      const seal = roll(1000, 7999);
      const intermediate = seal + roll(1, 90);
      const tested = intermediate + roll(1, 90);
      return {
        ...common,
        kind,
        recoveredSeal: `S-${seal}`,
        intermediateSeal: `S-${intermediate}`,
        testedSeal: `S-${tested}`,
        labSourceSeal: `S-${flawed ? tested + roll(1, 90) : intermediate}`,
        labReading: roll(12, 85),
      };
    }
    case 'revision': {
      const version = roll(1, 8);
      const offset = roll(25, 100);
      return {
        ...common,
        kind,
        originalVersion: version,
        signedVersion: version + (flawed ? 0 : 1),
        citedVersion: version + 2,
        signedAt: at,
        feeRemovedAt: at + (flawed ? offset : -offset),
        citedAt: at + 120,
        fee: roll(5, 35) * 1000,
      };
    }
    default:
      return { ...common, ...createAdditional(kind, roll, at, flawed) };
  }
}

// Validate the relationships against the private case mode. Both modes use the
// same exhibit structure; only the critical facts change. Mode stays on the server.
export function validateScenario(s: Scenario): void {
  if ('facts' in s) return validateCatalog(s);
  let valid: boolean;
  let hasFlaw: boolean;
  switch (s.kind) {
    case 'clock': {
      const actual = s.displayed - s.fastBy;
      valid =
        s.theftStart < s.theftEnd &&
        s.fastBy > 0 &&
        actual >= 0 &&
        actual <= s.theftEnd;
      hasFlaw = actual < s.theftStart;
      break;
    }
    case 'travel':
      valid =
        s.seen < s.theftStart &&
        s.theftStart < s.theftEnd &&
        s.minimumJourney > 0;
      hasFlaw = s.seen + s.minimumJourney > s.theftEnd;
      break;
    case 'visibility':
      valid = s.outageStart < s.outageEnd && s.outageStart < s.identified;
      hasFlaw = s.identified < s.outageEnd;
      break;
    case 'access':
      valid = s.users > 1 && s.transfer > 0 && s.revokedAt !== s.at;
      hasFlaw = s.revokedAt > s.at;
      break;
    case 'ledger': {
      const approved = s.payment * s.transactions;
      const duplicate = s.transactionId === s.secondTransactionId;
      valid =
        s.payment > 0 &&
        s.transactions > 1 &&
        s.claimedTotal === approved + s.payment &&
        s.bankTotal === approved + (duplicate ? 0 : s.payment);
      hasFlaw = duplicate;
      break;
    }
    case 'vehicle':
      valid = s.suspectPlate !== s.recordedPlate && s.plateChangedAt !== s.at;
      hasFlaw = s.plateChangedAt < s.at;
      break;
    case 'custody':
      valid =
        new Set([s.recoveredSeal, s.intermediateSeal, s.testedSeal]).size ===
          3 && s.labReading > 0;
      hasFlaw = s.labSourceSeal !== s.intermediateSeal;
      break;
    case 'revision':
      valid =
        s.citedVersion === s.originalVersion + 2 &&
        s.citedAt > s.signedAt &&
        s.citedAt > s.feeRemovedAt &&
        s.feeRemovedAt !== s.signedAt &&
        s.fee > 0 &&
        s.signedVersion ===
          s.originalVersion + (s.feeRemovedAt < s.signedAt ? 1 : 0);
      hasFlaw = s.signedAt < s.feeRemovedAt;
      break;
    default:
      ({ valid, hasFlaw } = validateAdditional(s));
  }
  if (!valid || hasFlaw !== (s.mode === 'flawed'))
    throw new Error(
      `Invalid ${s.kind} scenario: facts disagree with the intended case mode.`,
    );
}

export function renderScenario(s: Scenario): PrivateCase {
  validateScenario(s);
  const flawed = s.mode === 'flawed';
  let accusation: string;
  let evidence: string[];
  let solution: string;
  let challenge: string;
  if ('facts' in s) {
    ({ accusation, evidence, solution, challenge } = renderCatalog(s));
  } else
    switch (s.kind) {
      case 'clock':
        accusation = `You are accused of taking equipment from the ${s.site} warehouse on ${s.day}. The prosecution relies on security footage and the warehouse's inventory records.`;
        evidence = [
          `Checked door and inventory monitors place the removal between ${time(s.theftStart)} and ${time(s.theftEnd)} in official time.`,
          `The camera identifies you carrying the missing inventory crate by its visible stock number. The frame's displayed time is ${time(s.displayed)}.`,
          `At a calibration check, the reference clock read 09:00 and the camera read ${time(9 * 60 + s.fastBy)}. The offset remained constant throughout the day.`,
          `Your authorized handover work ended at ${time(s.theftStart - 1)}. Earlier crate movements were permitted; the equipment removed during the monitored interval had no release authorization.`,
          'You knew the storage layout and had disputed your overtime pay. The camera frame is the prosecution’s evidence linking you to the removal interval.',
        ];
        solution = `The camera is ${s.fastBy} minutes fast: ${time(s.displayed)} converts to ${time(s.displayed - s.fastBy)}. This falls ${flawed ? 'before' : 'inside'} the ${time(s.theftStart)}–${time(s.theftEnd)} removal window. ${flawed ? 'The timing fails to link the frame to the theft.' : 'The calibration supports the timing; invoking the clock offset does not undermine this link.'}`;
        challenge =
          'The calibration shows the camera is fast. Correcting its timestamp puts the frame before the theft window, during my authorized work.';
        break;
      case 'travel':
        accusation = `You are accused of taking a sealed file from the ${s.site} archive on ${s.day}. The prosecution says you travelled there from the administration office.`;
        evidence = [
          `The archive alarm and camera place the break-in and removal between ${time(s.theftStart)} and ${time(s.theftEnd)}. Their clocks use official time.`,
          `Office footage identifies you at the administration desk at ${time(s.seen)}. The office clock was synchronized with the archive clocks.`,
          `An agreed reconstruction establishes ${s.minimumJourney} minutes as the minimum journey from the desk to the archive by any means available that day.`,
          'An examiner identifies you in archive footage removing the file. A clear fingerprint of yours was recovered from its storage drawer.',
          'You knew the archive layout but had never been authorized to handle that drawer. The prosecution alleges that you personally removed the file.',
        ];
        solution = `Your earliest arrival is ${time(s.seen + s.minimumJourney)}, calculated from ${time(s.seen)} plus ${s.minimumJourney} minutes. ${flawed ? `That is after the removal ended at ${time(s.theftEnd)}, so the alleged journey is impossible.` : `That permits arrival before the removal starts at ${time(s.theftStart)}; the office sighting supplies no timing alibi.`}`;
        challenge =
          'The office timestamp and minimum journey time put my earliest arrival after the archive break-in ended. I could not have personally removed the file in that interval.';
        break;
      case 'visibility':
        accusation = `You are accused of starting a fire inside the ${s.site} loading bay on ${s.day}. A colleague identifies you as the person who lit it.`;
        evidence = [
          `The colleague reports seeing your face at ${time(s.identified)} under the ceiling floodlights, then watching you ignite packaging. The colleague's watch was checked against official time.`,
          `The switching log records the bay lighting breaker opening at ${time(s.outageStart)} and closing at ${time(s.outageEnd)}. Those entries use official time.`,
          'The wiring schedule puts every bay floodlight on that breaker, with no backup supply. A closed breaker powers the lights; an open breaker disconnects them. The bay has no daylight openings.',
          'The colleague knew you well and stood several metres away. The identification was made before the fire itself produced light.',
          'Your assignment gave you access to the bay. Burn patterns support the reported ignition point, while the colleague provides the identification of the person responsible.',
        ];
        solution = `Recognition is reported at ${time(s.identified)}. The floodlights were disconnected from ${time(s.outageStart)} to ${time(s.outageEnd)}. ${flawed ? 'The identification falls inside that interval, so its stated illumination was unavailable.' : 'The breaker had already closed, so the lights were powered when the colleague identified you.'}`;
        challenge =
          'Connecting the witness’s time with the breaker log and wiring schedule shows the floodlights were off during the identification. The claimed facial recognition is unreliable.';
        break;
      case 'access':
        accusation = `You are accused of authorizing a ${money(s.transfer)} payment to your own company from the ${s.site} office on ${s.day}. The payment had no business approval.`;
        evidence = [
          `The bank records the transfer at ${time(s.at)} using account ${s.account}. The recipient's verified company registration names you as its owner.`,
          `The original access register granted working credentials for ${s.account} to ${s.users} staff, including you.`,
          `At ${time(s.revokedAt)}, an authenticated access change revoked every other user's credentials and retained yours. The system immediately invalidated their active sessions and stored tokens.`,
          'The transaction audit identifies the account but carries no individual operator identifier. The access-change log and bank timestamp share the same checked clock.',
          'Finance confirms there was no approved invoice, gift, or refund supporting this payment. You had helped configure the account.',
        ];
        solution = `Other users lost access at ${time(s.revokedAt)}, while the transfer occurred at ${time(s.at)}. ${flawed ? `All ${s.users} credential holders still had access at transfer time, so the account log does not uniquely identify you.` : 'Only your credentials remained active at transfer time. The earlier shared-access register does not establish an alternative authorized operator for this transaction.'}`;
        challenge =
          'The access register and revocation timing show other staff could still use this account when the transfer happened. The account name alone does not identify me as its operator.';
        break;
      case 'ledger': {
        const approved = s.payment * s.transactions;
        accusation = `You are accused of diverting ${money(s.payment)} while processing the ${s.site} payment batch on ${s.day}. An outgoing-payment spreadsheet exceeds the authorized schedule.`;
        evidence = [
          `The signed schedule authorizes ${s.transactions} payments of ${money(s.payment)} each to listed suppliers. Those were the batch's only authorized payments.`,
          `The imported spreadsheet totals ${money(s.claimedTotal)}. You prepared the import and had authority to process the signed schedule.`,
          `The complete bank statement totals this batch at ${money(s.bankTotal)}. ${flawed ? 'Every debit names an approved supplier.' : `One debit of ${money(s.payment)} names your personal account as recipient.`}`,
          `Two import rows carry IDs ${s.transactionId} and ${s.secondTransactionId}, each for ${money(s.payment)}. The bank assigns a unique ID to each transfer, and each ID occurs once on its statement.`,
          'The import includes all batch debits. Each bank transfer bears your individual authenticated approval. Remaining rows match the schedule; no reversals or adjustments occurred.',
        ];
        solution = `Authorized payments total ${money(approved)}. ${flawed ? `The two ${s.transactionId} rows repeat one transfer; subtracting ${money(s.payment)} from the spreadsheet gives the bank total of ${money(s.bankTotal)}. The alleged missing amount is a duplicate import.` : `The two row IDs differ. Bank debits total ${money(s.bankTotal)}, including the extra ${money(s.payment)} to your account. The excess is a real transfer, not a duplicated row.`}`;
        challenge =
          'The import counted the same bank transfer twice. Removing the repeated row reconciles the spreadsheet with the authorized payments and the bank statement.';
        break;
      }
      case 'vehicle':
        accusation = `You are accused of driving the van used in a robbery at the ${s.site} depot on ${s.day}. The prosecution links the departing vehicle to your registration history.`;
        evidence = [
          `At ${time(s.at)}, depot footage shows the stolen crates loaded into a ${s.color} van bearing plate ${s.recordedPlate}, which then departs. The plate is clear; the driver’s face is obscured.`,
          `Your van's registration history records a change from ${s.recordedPlate} to ${s.suspectPlate} at ${time(s.plateChangedAt)} that day. Both entries identify the same vehicle chassis.`,
          'An authenticated workshop record places the physical plate replacement at the registry change time. The recorded registration was displayed up to that change, and the replacement registration afterward.',
          `A witness describes the departing van's ${s.color} bodywork and general build. These match your van; the witness could not identify the driver.`,
          `An authenticated in-cab recording identifies you driving your own van continuously from ${time(s.at - 5)} to ${time(s.at + 5)}. Its chassis number matches the registry.`,
        ];
        solution = `The camera records ${s.recordedPlate} at ${time(s.at)}; your plates changed to ${s.suspectPlate} at ${time(s.plateChangedAt)}. ${flawed ? 'The replacement was already fitted by the recorded departure, so that registration does not identify your van at the relevant time.' : 'The departure precedes the replacement. Your van still displayed the recorded plate, so comparing the footage only to the later registration creates a false discrepancy.'}`;
        challenge =
          'The registration history and physical replacement record show my van had its new plate by the time of the camera image. The camera’s old plate does not identify my van at that time.';
        break;
      case 'custody':
        accusation = `You are accused of storing a prohibited accelerant in your locker at ${s.site} on ${s.day}. The prosecution attributes a positive laboratory result to the recovered container.`;
        evidence = [
          `The recovery photograph shows the sample from your locker sealed as ${s.recoveredSeal}. The signed search record identifies your individually assigned, locked compartment.`,
          `The lab reports ${s.labReading} milligrams of the prohibited accelerant in the sample delivered under intact seal ${s.testedSeal}.`,
          `The first witnessed repackaging record transfers ${s.recoveredSeal} into new seal ${s.intermediateSeal}. The original packaging was damaged during transport.`,
          `The later witnessed laboratory-preparation record transfers ${s.labSourceSeal} into new seal ${s.testedSeal}. It records one source container and no pooled samples.`,
          'The custody register is complete: each transfer preserves the named container’s contents, and these are the only seal changes recorded. You held the locker’s only issued key.',
        ];
        solution = `The locker sample follows ${s.recoveredSeal} → ${s.intermediateSeal}. The lab sample follows ${s.labSourceSeal} → ${s.testedSeal}. ${flawed ? 'Those chains do not join in the complete register, so the positive result is not linked to your recovered sample.' : 'The chains join through the intermediate seal. The documented repackaging explains the changed label and preserves the connection to your sample.'}`;
        challenge =
          'Following the two custody transfers shows the chain from my locker sample does not reach the seal tested by the laboratory. The positive result has not been linked to that sample.';
        break;
      case 'revision':
        accusation = `You are accused of falsely certifying a ${money(s.fee)} fee in the ${s.site} contract on ${s.day}. Your certification refers to the document you signed.`;
        evidence = [
          `The authenticated signature record binds you to version ${s.signedVersion} at ${time(s.signedAt)}. The signed file has remained unchanged.`,
          `The certified archive shows that original version ${s.originalVersion} included the ${money(s.fee)} fee.`,
          `Version ${s.originalVersion + 1}, issued at ${time(s.feeRemovedAt)}, deleted the fee. The complete change log records no subsequent reinstatement.`,
          `The prosecution quotes version ${s.citedVersion}, issued at ${time(s.citedAt)}. That version corrected only an address and carries forward the prior version's fee terms.`,
          `At signing, you certified that the signed version included the ${money(s.fee)} fee. You had negotiated that fee and would benefit from its inclusion.`,
        ];
        solution = `The fee was removed in version ${s.originalVersion + 1} at ${time(s.feeRemovedAt)}. You signed version ${s.signedVersion} at ${time(s.signedAt)}. ${flawed ? 'Your signed version still contained the fee; the later deletion does not falsify your certification.' : 'You signed after removal, and the signed version already omitted the fee. The prosecution’s later copy preserves that same term, so its later date does not rescue the certification.'}`;
        challenge =
          'The signature and version history show I signed while the fee was still included. The fee was removed later, so the prosecution’s later copy does not make my certification false.';
        break;
      default:
        ({ accusation, evidence, solution, challenge } = renderAdditional(s));
    }
  const roll = random(s.seed ^ 0x9e3779b9);
  for (let i = evidence.length - 1; i > 0; i--) {
    const j = roll(0, i);
    [evidence[i], evidence[j]] = [evidence[j], evidence[i]];
  }
  return {
    title: `${titles[s.kind]} · ${s.site} #${s.reference}`,
    category:
      'facts' in s
        ? 'REGULATORY EVIDENCE'
        : s.kind === 'ledger' || s.kind === 'access' || s.kind === 'revision'
          ? 'FINANCIAL EVIDENCE'
          : 'CRIMINAL EVIDENCE',
    accusation,
    evidence,
    solution,
    rubric: `Internal evaluation: ${solution} The sample challenge is ${flawed ? 'supported' : 'contradicted'} by the exhibits. Assess other arguments on their own evidence.`,
    sampleDefense: challenge,
  };
}

export function generateCase(
  recentTitles: string[] = [],
  seed = crypto.getRandomValues(new Uint32Array(1))[0],
): PrivateCase {
  // Keep recent stories out of the draw and separate cases with the same rule.
  const recent = recentTitles.slice(-12);
  const recentFamilies = recent.slice(-3).map((title) => {
    const kind = caseKinds.find((kind) =>
      title.startsWith(`${titles[kind]} ·`),
    );
    return kind && (isCatalogKind(kind) ? catalogFamily(kind) : kind);
  });
  const available = caseKinds.filter(
    (kind) =>
      !recent.some((title) => title.startsWith(`${titles[kind]} ·`)) &&
      !recentFamilies.includes(
        isCatalogKind(kind) ? catalogFamily(kind) : kind,
      ),
  );
  const roll = random(seed);
  const kind = available[roll(0, available.length - 1)];
  return renderScenario(createScenario(kind, roll(0, 0xffffffff)));
}
