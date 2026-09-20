import type { PrivateCase } from './game.ts';
import { stories, type StoryKind } from './story-catalog.ts';

const storyKinds = Object.keys(stories) as StoryKind[];

export const scenarioVersion = 'criminal-50-v1';
export const caseKinds = [
  'workshop',
  'stairwell',
  'loading_dock',
  'station',
  'pharmacy',
  'jeweler',
  'bus',
  'courier',
  'bank_call',
  'charity',
  'storage',
  'restaurant',
  ...storyKinds,
] as const;
export type CaseKind = (typeof caseKinds)[number];
export const caseBranches = ['supported', 'alternative', 'unresolved'] as const;
export type CaseBranch = (typeof caseBranches)[number];
export const catalog: Record<CaseKind, { title: string; category: string }> = {
  ...stories,
  workshop: { title: 'Death at the workshop', category: 'HOMICIDE' },
  stairwell: { title: 'The stairwell death', category: 'HOMICIDE' },
  loading_dock: { title: 'The loading dock assault', category: 'ASSAULT' },
  station: { title: 'The station passage', category: 'ASSAULT' },
  pharmacy: { title: 'The pharmacy break-in', category: 'BURGLARY' },
  jeweler: { title: 'The jeweler’s workshop', category: 'BURGLARY' },
  bus: { title: 'The last bus', category: 'ROBBERY' },
  courier: { title: 'The depot collection', category: 'ROBBERY' },
  bank_call: { title: 'The bank impersonator', category: 'FRAUD' },
  charity: { title: 'The hospital collection', category: 'FRAUD' },
  storage: { title: 'The storage unit fire', category: 'ARSON' },
  restaurant: { title: 'The restaurant fire', category: 'ARSON' },
};

const minute = 60_000;
const day = 24 * 60 * minute;
const places = [
  'Northgate',
  'Westhaven',
  'Riverside',
  'Eastwick',
  'Fairmont',
  'Hillcrest',
  'Brookfield',
  'Ashford',
];

type Details =
  | {
      kind: StoryKind;
      branch: CaseBranch;
      earlierAt: number;
      laterAt: number;
      previousAt: number;
      weekAt: number;
      nextAt: number;
      labAt: number;
      amount: number;
    }
  | {
      kind: 'workshop';
      departureDisplay: number;
      clockOffsetMinutes: number;
      clockErrorMinutes: number;
      entryAt: number;
    }
  | {
      kind: 'stairwell';
      lightsRestoredAt: number;
      independentIdentification: boolean;
    }
  | {
      kind: 'loading_dock';
      recording: 'complete_attack' | 'disputed_force' | 'cropped';
    }
  | {
      kind: 'station';
      barrierRemovedAt: number;
      secondAccount: 'independent' | 'repeated';
    }
  | {
      kind: 'pharmacy';
      departureAt: number;
      journeyMinutes: number;
      journeyUncertaintyMinutes: number;
      searchAt: number;
      examinedAt: number;
    }
  | {
      kind: 'jeweler';
      traceSurface: 'fresh_fracture' | 'service_panel' | 'loose_tool';
      visitAt: number;
      collectedAt: number;
      examinedAt: number;
      offeredAt: number;
    }
  | {
      kind: 'bus';
      loanedAt: number;
      returnedAt: number;
      spareKeyReturned: boolean;
      driverImage: 'clear' | 'obscured';
      plate: string;
    }
  | {
      kind: 'courier';
      badgeReassignedAt: number;
      faceImage: 'clear' | 'obscured';
      badge: number;
    }
  | {
      kind: 'bank_call';
      access: 'exclusive' | 'remote_session' | 'shared_laptop';
      sessionStartedAt: number;
      sessionEndedAt: number;
      withdrawnAt: number;
      examinedAt: number;
      amount: number;
    }
  | {
      kind: 'charity';
      identification: 'continuous' | 'prompted' | 'partial';
      priorEventAt: number;
      searchedAt: number;
      amount: number;
      tin: number;
    }
  | {
      kind: 'storage';
      sceneSeal: number;
      testedSeal: number;
      comparison: 'physical_fit' | 'same_fabric';
      collectedAt: number;
      receivedAt: number;
      examinedAt: number;
    }
  | {
      kind: 'restaurant';
      origin: 'poured_fuel' | 'competing_origins' | 'undetermined';
    };

export type Scenario = Details & {
  seed: number;
  site: string;
  reference: number;
  incidentAt: number;
};

function random(seed: number) {
  let state = seed >>> 0;
  return (min: number, max: number) => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return (
      min +
      Math.floor(
        (((value ^ (value >>> 14)) >>> 0) / 4294967296) * (max - min + 1),
      )
    );
  };
}

// Timestamps are UTC milliseconds; offsets and durations are explicitly in minutes.
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
});
export function time(timestamp: number): string {
  return dateTimeFormat.format(timestamp);
}
const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

export function createScenario(
  kind: CaseKind,
  seed: number,
  requestedBranch?: CaseBranch,
): Scenario {
  const roll = random(seed);
  const draw = roll(0, 3);
  const branch =
    requestedBranch ??
    (draw < 2 ? 'supported' : draw === 2 ? 'alternative' : 'unresolved');
  const incidentAt = Date.UTC(
    2026,
    roll(0, 11),
    roll(1, 27),
    catalog[kind].category === 'FRAUD' ? roll(9, 16) : roll(18, 23),
    roll(0, 59),
  );
  const base = {
    seed,
    site: places[roll(0, places.length - 1)],
    reference: roll(1000, 9999),
    incidentAt,
  };
  const at = incidentAt;
  const incidentDay = at - (at % day);
  roll(8, 18); // Preserve the parameter sequence of earlier seeds.
  const gap = roll(3, 6);
  let details: Details;
  switch (kind) {
    case 'workshop':
      details = {
        kind,
        departureDisplay: at + gap * minute,
        clockOffsetMinutes: branch === 'alternative' ? gap + 1 : 0,
        clockErrorMinutes:
          branch === 'supported' ? 0 : branch === 'alternative' ? 2 : gap + 2,
        entryAt: at - 30 * minute,
      };
      break;
    case 'stairwell':
      details = {
        kind,
        lightsRestoredAt: at + (branch === 'alternative' ? gap : -gap) * minute,
        independentIdentification: branch === 'supported',
      };
      break;
    case 'loading_dock':
      details = {
        kind,
        recording:
          branch === 'supported'
            ? 'complete_attack'
            : branch === 'alternative'
              ? 'disputed_force'
              : 'cropped',
      };
      break;
    case 'station':
      details = {
        kind,
        barrierRemovedAt: at + (branch === 'alternative' ? gap : -gap) * minute,
        secondAccount: branch === 'supported' ? 'independent' : 'repeated',
      };
      break;
    case 'pharmacy': {
      const journeyMinutes = roll(24, 38);
      details = {
        kind,
        journeyMinutes,
        departureAt:
          at -
          (journeyMinutes + (branch === 'alternative' ? -gap : gap)) * minute,
        journeyUncertaintyMinutes: branch === 'supported' ? 0 : gap + 2,
        searchAt: incidentDay + day + 9 * 60 * minute,
        examinedAt: incidentDay + 2 * day + 14 * 60 * minute,
      };
      break;
    }
    case 'jeweler':
      details = {
        kind,
        traceSurface:
          branch === 'supported'
            ? 'fresh_fracture'
            : branch === 'alternative'
              ? 'service_panel'
              : 'loose_tool',
        visitAt: incidentDay - roll(3, 7) * day + 10 * 60 * minute,
        collectedAt: at + 2 * 60 * minute,
        examinedAt: incidentDay + 2 * day + 14 * 60 * minute,
        offeredAt: at + 45 * minute,
      };
      break;
    case 'bus':
      details = {
        kind,
        loanedAt: incidentDay - day + 10 * 60 * minute,
        returnedAt:
          incidentDay + (branch === 'alternative' ? day : 0) + 12 * 60 * minute,
        spareKeyReturned: branch === 'supported',
        driverImage: branch === 'supported' ? 'clear' : 'obscured',
        plate: `K${roll(10, 99)}-${roll(100, 999)}`,
      };
      break;
    case 'courier':
      details = {
        kind,
        badgeReassignedAt:
          at + (branch === 'alternative' ? -gap : gap) * minute,
        faceImage: branch === 'supported' ? 'clear' : 'obscured',
        badge: roll(100, 999),
      };
      break;
    case 'bank_call':
      details = {
        kind,
        access:
          branch === 'supported'
            ? 'exclusive'
            : branch === 'alternative'
              ? 'remote_session'
              : 'shared_laptop',
        sessionStartedAt: at - 20 * minute,
        sessionEndedAt: at + 10 * minute,
        withdrawnAt: at + 45 * minute,
        examinedAt: incidentDay + 2 * day + 14 * 60 * minute,
        amount: roll(2, 9) * 100,
      };
      break;
    case 'charity':
      details = {
        kind,
        identification:
          branch === 'supported'
            ? 'continuous'
            : branch === 'alternative'
              ? 'prompted'
              : 'partial',
        priorEventAt: incidentDay - roll(14, 28) * day + 12 * 60 * minute,
        searchedAt: incidentDay + day + 9 * 60 * minute,
        amount: roll(8, 30) * 100,
        tin: roll(100, 999),
      };
      break;
    case 'storage': {
      const sceneSeal = roll(1000, 8999);
      details = {
        kind,
        sceneSeal,
        testedSeal: sceneSeal + (branch === 'alternative' ? 1 : 0),
        comparison: branch === 'unresolved' ? 'same_fabric' : 'physical_fit',
        collectedAt: at + 3 * 60 * minute,
        receivedAt: incidentDay + day + 10 * 60 * minute,
        examinedAt: incidentDay + 3 * day + 14 * 60 * minute,
      };
      break;
    }
    case 'restaurant':
      details = {
        kind,
        origin:
          branch === 'supported'
            ? 'poured_fuel'
            : branch === 'alternative'
              ? 'competing_origins'
              : 'undetermined',
      };
      break;
    default:
      details = {
        kind,
        branch,
        earlierAt: at - 15 * minute,
        laterAt: at + 30 * minute,
        previousAt: incidentDay - day + 10 * 60 * minute,
        weekAt: incidentDay - 7 * day + 10 * 60 * minute,
        nextAt: incidentDay + day + 10 * 60 * minute,
        labAt: incidentDay + 3 * day + 14 * 60 * minute,
        amount: roll(2, 9) * 100,
      };
  }
  const scenario = { ...base, ...details };
  validateScenario(scenario);
  return scenario;
}

export type CaseReview = {
  // null means the record is intentionally contested; neither verdict is a test failure.
  expectedVerdict: 'guilty' | null;
  hasContradiction: boolean;
  truth: string;
  reason: string;
  prosecutionArgument: string;
  defenseArgument: string;
  conciseDefense: string;
  plausibleMistake: string;
};

export function reviewScenario(s: Scenario): CaseReview {
  if ('branch' in s) {
    const issue = stories[s.kind].issue;
    return {
      expectedVerdict: s.branch === 'supported' ? 'guilty' : null,
      hasContradiction: false,
      truth:
        'This structure specifies the public record. An underlying actor is not assigned to its contested variants.',
      reason: issue,
      prosecutionArgument:
        'Assess the incident, identification, and corroborating records together. ' +
        issue,
      defenseArgument: issue,
      conciseDefense: issue,
      plausibleMistake:
        'Being mentioned in an evidence record by itself proves that the defendant committed the entire crime.',
    };
  }
  let supported: boolean;
  let hasContradiction = false;
  let truth: string;
  let prosecutionArgument: string;
  let defenseArgument: string;
  let conciseDefense: string;
  let plausibleMistake: string;
  switch (s.kind) {
    case 'workshop': {
      const departure = s.departureDisplay - s.clockOffsetMinutes * minute;
      supported = departure - s.clockErrorMinutes * minute > s.incidentAt;
      truth = `${s.clockOffsetMinutes > 0 ? 'Another worker' : 'The defendant'} committed the fatal assault. The corridor clock estimate has the uncertainty stated in the calibration record.`;
      prosecutionArgument =
        'The defendant was alone with the victim before the assault and was seen leaving with an object resembling the weapon. The recorded departure may follow the attack.';
      defenseArgument = supported
        ? 'The departure must be corrected before comparing it with the assault; in this record its entire range follows the attack, so a timing objection needs to confront the exclusive-access footage.'
        : 'The corrected departure range reaches before the attack. The witness saw a bar-shaped object used by several workers, not the assault. Explain why access before the incident does not settle presence during it.';
      conciseDefense =
        'Apply the clock correction and its uncertainty to the departure, then weigh the witness’s observation against that range.';
      plausibleMistake =
        'The displayed departure time is the actual departure time; the calibration does not matter.';
      break;
    }
    case 'stairwell':
      supported = s.independentIdentification;
      hasContradiction = s.lightsRestoredAt > s.incidentAt;
      truth = `${supported ? 'The defendant' : 'Another resident'} pushed the victim. In the contested record, witnesses interpreted a brief view and a voice as belonging to the defendant.`;
      prosecutionArgument = supported
        ? 'A close recording identifies the defendant delivering the push; the medical record connects the fall to the death.'
        : 'A familiar neighbor identifies the defendant, and a second resident recognizes the voice. Presence and the earlier argument support those accounts.';
      defenseArgument = supported
        ? 'Question the distant witness’s lighting and brief view, but account for the separate close recording before treating that weakness as material.'
        : 'The face was glimpsed from 35 metres away. Check the lamp timing, then distinguish the second witness’s voice recognition from their repeated visual identification. Explain why those links may reinforce the same mistake.';
      conciseDefense =
        'Separate what each witness personally perceived from what they learned from the other witness.';
      plausibleMistake =
        'Two statements identifying the same person always count as two independent visual identifications.';
      break;
    case 'loading_dock':
      supported = s.recording === 'complete_attack';
      hasContradiction = !supported;
      truth =
        s.recording === 'disputed_force'
          ? 'The injured worker swung a hook, lowered it while stepping back, and was then pushed by the defendant. The defendant still feared another swing.'
          : 'The defendant initiated the confrontation and caused the fall; the cropped branch loses the start of the recording.';
      prosecutionArgument = supported
        ? 'Uninterrupted video and the dispatch caller describe an unprovoked attack causing the injury.'
        : 'The defendant caused the injurious fall. The complaint alleges an attack, and the visible push may have exceeded what was needed at that moment.';
      defenseArgument = supported
        ? 'The earlier dispute and the hook’s presence give context, but the uninterrupted lead-in shows the worker standing with empty hands.'
        : s.recording === 'disputed_force'
          ? 'The hook had just been swung and remained in the worker’s hand. Explain why stepping back and lowering it may not have ended the immediate threat, while addressing the timing and force of the push.'
          : 'The contemporaneous call describes a hook attack before the clip begins. Use that sequence to challenge the unprovoked-attack account, while acknowledging that the missing lead-in does not establish every use of force was justified.';
      conciseDefense =
        'Distinguish the earlier threat from whether the particular push was necessary when it happened.';
      plausibleMistake =
        'Whoever suffered the worse injury must have been the innocent party.';
      break;
    case 'station':
      supported = s.secondAccount === 'independent';
      truth = `${supported ? 'The defendant' : 'Another passenger in a similar coat'} struck the passenger. The first witness saw the defendant nearby just after hearing the impact.`;
      prosecutionArgument = supported
        ? 'Independent close footage identifies the defendant striking a passenger who offered no threat.'
        : 'A witness familiar with the defendant places their face at the scene immediately after the blow. A second witness describes the departing person’s coat and direction.';
      defenseArgument = supported
        ? 'A screen may weaken the kiosk witness’s account, but the separate platform recording directly records the act.'
        : 'The first witness looked up after the impact, and the screen may conceal the movement of the hands. The second account adds clothing and direction rather than a face. Explain the gap between identifying someone nearby and identifying the person who struck.';
      conciseDefense =
        'Reconstruct what each viewpoint could establish about the strike, not just who was nearby afterward.';
      plausibleMistake =
        'A witness who heard the impact necessarily saw who delivered it.';
      break;
    case 'pharmacy': {
      const arrival = s.departureAt + s.journeyMinutes * minute;
      supported = arrival + s.journeyUncertaintyMinutes * minute < s.incidentAt;
      truth =
        'The defendant broke into the pharmacy. The reconstruction is a trial journey; the uncertain branches do not establish the exact trip made that night.';
      prosecutionArgument =
        'The owner identifies the defendant in the footage, and stolen stock was recovered in a shared cupboard with a bag bearing the defendant’s print. The reconstructed travel range permits arrival.';
      defenseArgument = supported
        ? 'Shared storage and an exterior print do not establish exclusive possession, but the clear identification and feasible journey are independent evidence that an argument must address.'
        : 'The travel estimate varies with waiting and route conditions, and the identification rests on a partly covered image. An exterior bag print can predate the theft. Weigh the combined uncertainty; the central journey estimate alone is not an alibi.';
      conciseDefense =
        'Compare the full journey range with the incident, then address the image quality and what the bag print actually connects.';
      plausibleMistake =
        'A reconstruction that usually arrives late proves the defendant could never have arrived in time.';
      break;
    }
    case 'jeweler':
      supported = s.traceSurface === 'fresh_fracture';
      truth = `${supported ? 'The defendant' : 'A colleague using the shared work laptop'} stole the watches. In the contested branches the print came from the earlier repair.`;
      prosecutionArgument = supported
        ? 'A print on a newly exposed internal surface and an identified offer of a stolen watch connect the defendant to the burglary.'
        : 'The defendant was near the workshop, their print was recovered, and a stolen watch was offered from their work laptop through the shared sales account.';
      defenseArgument = supported
        ? 'Earlier lawful contact explains prints on accessible surfaces, but this lift came from a surface exposed during the intrusion and is corroborated by the identified sale.'
        : 'Match the exact lift location to the earlier repair photograph. Lawful contact may explain that print, while a shared account and laptop complicate the sale’s authorship. Address the nearby sighting instead of treating the print’s age as a complete alibi.';
      conciseDefense =
        'Separate the date of contact, location of the print, and identity of the person who posted the watch.';
      plausibleMistake =
        'Every print recovered after a burglary was deposited during it.';
      break;
    case 'bus':
      supported = s.driverImage === 'clear';
      truth = `${supported ? 'The defendant' : 'The borrower'} drove the van and robbed the bus. In the contested record both people could use a key during the incident.`;
      prosecutionArgument = supported
        ? 'Continuous face-visible footage identifies the defendant making the threat and taking the fare bag; the recovered numbered bag corroborates it.'
        : 'The van belongs to the defendant, who had a key. A driver who knows the defendant recognizes the robber’s voice and partial profile.';
      defenseArgument = supported
        ? 'Vehicle ownership alone is insufficient, but the continuous facial view and the bag recovered from the defendant create additional links to address.'
        : 'Use the dated loan and return records to establish the borrower’s actual access. Weigh that alternative against the defendant’s retained key and the driver’s brief, distracted recognition.';
      conciseDefense =
        'Who had access to the van that night, and how reliably does the driver identify the person who used it?';
      plausibleMistake =
        'The van’s registered owner must have been driving it during the robbery.';
      break;
    case 'courier':
      supported = s.faceImage === 'clear' && s.badgeReassignedAt > s.incidentAt;
      truth = `${s.badgeReassignedAt <= s.incidentAt ? 'A coworker' : 'The defendant'} used the badge and took the parcel. The roster change recorded administration, not a witnessed physical handover.`;
      prosecutionArgument = supported
        ? 'The continuous face-visible recording connects the defendant’s entry to the threat and taking.'
        : 'The badge was associated with the defendant, the supervisor recognizes a similar profile, and the parcel was found under the defendant’s workbench.';
      defenseArgument = supported
        ? 'Badge access and the recovery area were shared, but the direct facial recording supplies a separate identification.'
        : 'The roster and electronic reassignment do not prove who physically held the badge. The profile is partial and coworkers could use the loading bay. Explain how those uncertainties interact while accounting for the recovery under the defendant’s bench.';
      conciseDefense =
        'Distinguish badge assignment from physical possession and weigh the recovery location alongside the partial identification.';
      plausibleMistake =
        'An electronic badge reassignment proves the badge changed hands at that exact second.';
      break;
    case 'bank_call':
      supported = s.access === 'exclusive';
      truth = supported
        ? 'The defendant impersonated a bank investigator, directed the victim to transfer savings, and withdrew the stolen money.'
        : s.access === 'remote_session'
          ? 'A housemate used the remote session to place the fraudulent call and then used the defendant’s bank card, borrowed earlier for errands.'
          : 'A housemate used the shared laptop and the defendant’s bank card to conduct the scam and take the money.';
      prosecutionArgument =
        'A recorded bank impersonation caused a real loss. The call used the defendant’s laptop, the money entered their account, and the ATM image links their appearance to the withdrawal.';
      defenseArgument = supported
        ? 'Account ownership alone leaves identity open, but the private login and sole possession of the laptop and clear withdrawal image supply additional links that the defense must address.'
        : s.access === 'remote_session'
          ? 'Remote control was active during the call and the log does not distinguish local from remote input. Explain how the housemate’s documented access to the laptop and card affects attribution, while addressing the account and ATM resemblance.'
          : 'A housemate had documented access to the laptop, calling account, and bank card. Weigh that specific alternative against the defendant’s account ownership and the partly obscured ATM image.';
      conciseDefense =
        'Connect the call, computer session, recipient account, and cash withdrawal before deciding who knowingly carried out the scam.';
      plausibleMistake =
        'An account holder must personally have made every call that sent money into the account.';
      break;
    case 'charity':
      supported = s.identification === 'continuous';
      truth = supported
        ? 'The defendant falsely claimed to collect for the hospital and kept the cash.'
        : s.identification === 'prompted'
          ? 'A former volunteer used the shared collection equipment; the donor associated the collector with the defendant after seeing an old volunteer photograph.'
          : 'A former volunteer used the shared collection equipment and left the proceeds in the shared garage; the defendant had handled the tin at the earlier event.';
      prosecutionArgument =
        'Donors paid cash because the collector falsely claimed hospital authority. Witness identification, a matching collection tin, and recovered cash connect the defendant to the taking.';
      defenseArgument = supported
        ? 'Earlier volunteer work explains access to a badge, but continuous face-visible footage records the defendant making the false claim, collecting cash, and keeping it.'
        : s.identification === 'prompted'
          ? 'The donor named the defendant after viewing the hospital’s old volunteer photograph. Separate that prompted recognition from the brief original observation, then address the tin and money found among equipment available to other volunteers.'
          : 'The cap obscures the collector’s face, and the tin print can come from the dated earlier event. Explain how shared access affects the recovery evidence while acknowledging the collector’s matching jacket and build.';
      conciseDefense =
        'The hospital’s denial establishes the deception; assess separately whether the identification and recovered equipment establish the defendant as the collector.';
      plausibleMistake =
        'Having once volunteered for a hospital gives permission to collect money in its name forever.';
      break;
    case 'storage':
      supported =
        s.sceneSeal === s.testedSeal && s.comparison === 'physical_fit';
      truth =
        s.comparison === 'same_fabric'
          ? 'Another person in a coat from the same fabric batch ignited the unit; burning prevented an edge comparison.'
          : 'The defendant ignited the unit. In the repackaged branch, an officer replaced a wet evidence bag but left the second signature incomplete.';
      prosecutionArgument =
        'The recording shows deliberate ignition and a fresh coat tear. The defendant wore a torn coat throughout the interval, and the laboratory found compatible material.';
      defenseArgument = supported
        ? 'The scene seal and physical edge fit create an individual connection, so a general objection that similar coats exist does not address this particular match.'
        : s.sceneSeal !== s.testedSeal
          ? 'The intake photo and officer’s account support continuity, but the seal changed and the second signature is blank. Explain why that missing check affects confidence in this particular sample; a paperwork omission alone does not establish substitution.'
          : 'The weave and dye match a locally sold batch, while charring prevents an edge fit. Explain the difference between a compatible coat and an individual match, while addressing the timing and fresh damage.';
      conciseDefense =
        'Assess how much the provenance and comparison method justify identifying this coat as the one in the fire recording.';
      plausibleMistake =
        'Any missing evidence signature makes every laboratory finding worthless.';
      break;
    case 'restaurant':
      supported = s.origin === 'poured_fuel';
      hasContradiction = s.origin === 'competing_origins';
      truth =
        s.origin === 'competing_origins'
          ? 'The electrical fault started the fire near solvent used for cleaning; the examiners disagree about the damaged traces.'
          : 'The defendant deliberately ignited the office; damage obscures the cause in the unresolved branch.';
      prosecutionArgument = supported
        ? 'A poured-fuel trail and ignition match establish deliberate ignition; continuous access footage places only the defendant in the office immediately beforehand.'
        : 'The defendant was the only recent visitor, had made a threatening remark, and had fuel in the car. Burning near the desk supports the deliberate-ignition theory.';
      defenseArgument = supported
        ? 'The recorded socket fault gives a possible alternative to investigate, but the origin report addresses it and ties this fire to a separate poured trail.'
        : s.origin === 'competing_origins'
          ? 'A second examiner links the origin to the documented socket fault, and cleaning can explain solvent residue. Reconcile that evidence with the first report, exclusive access, and threatening remark; citing the maintenance ticket alone does not establish an accidental fire.'
          : 'The examiner cannot establish the order of ignition from the damaged traces. The socket fault and ordinary use of the fuel offer concrete alternatives, but presence and the threat still support the prosecution. Explain why cause remains uncertain after weighing them.';
      conciseDefense =
        'Weigh both origin accounts and distinguish possession of fuel and a threat from proof of deliberate ignition.';
      plausibleMistake =
        'An earlier electrical fault proves that any later fire must be accidental.';
      break;
  }
  return {
    expectedVerdict: supported ? 'guilty' : null,
    hasContradiction,
    truth,
    reason: `${prosecutionArgument} ${defenseArgument}`,
    prosecutionArgument,
    defenseArgument,
    conciseDefense,
    plausibleMistake,
  };
}

export function validateScenario(s: Scenario): void {
  const validTime = (value: number) =>
    Number.isSafeInteger(value) && Number.isFinite(new Date(value).getTime());
  let valid = validTime(s.incidentAt);
  for (const [key, value] of Object.entries(s)) {
    if (typeof value === 'number') {
      valid &&= Number.isSafeInteger(value);
      if (key.endsWith('At') || key === 'departureDisplay')
        valid &&= validTime(value);
    }
  }
  const at = s.incidentAt;
  if ('branch' in s) {
    valid &&=
      caseBranches.includes(s.branch) &&
      s.weekAt < s.previousAt &&
      s.previousAt < s.earlierAt &&
      s.earlierAt < at &&
      at < s.laterAt &&
      s.laterAt < s.nextAt &&
      s.nextAt < s.labAt &&
      s.amount >= 200 &&
      s.amount <= 900;
    if (!valid)
      throw new Error(`Invalid ${s.kind} facts, units, or chronology`);
    return;
  }
  switch (s.kind) {
    case 'workshop':
      valid &&=
        s.clockOffsetMinutes >= 0 &&
        s.clockOffsetMinutes <= 18 &&
        s.clockErrorMinutes >= 0 &&
        s.clockErrorMinutes <= 8 &&
        s.entryAt < at &&
        s.entryAt <
          s.departureDisplay -
            (s.clockOffsetMinutes + s.clockErrorMinutes) * minute;
      break;
    case 'stairwell':
      valid &&=
        Math.abs(s.lightsRestoredAt - at) <= 6 * minute &&
        !(s.independentIdentification && s.lightsRestoredAt > at);
      break;
    case 'loading_dock':
      valid &&= ['complete_attack', 'disputed_force', 'cropped'].includes(
        s.recording,
      );
      break;
    case 'station':
      valid &&=
        Math.abs(s.barrierRemovedAt - at) <= 6 * minute &&
        !(s.secondAccount === 'independent' && s.barrierRemovedAt > at);
      break;
    case 'pharmacy':
      valid &&=
        s.departureAt < at &&
        s.journeyMinutes >= 24 &&
        s.journeyMinutes <= 38 &&
        s.journeyUncertaintyMinutes >= 0 &&
        s.journeyUncertaintyMinutes <= 8 &&
        at < s.searchAt &&
        s.searchAt < s.examinedAt;
      break;
    case 'jeweler':
      valid &&=
        s.visitAt < at &&
        at < s.collectedAt &&
        s.collectedAt < s.examinedAt &&
        at < s.offeredAt &&
        ['fresh_fracture', 'service_panel', 'loose_tool'].includes(
          s.traceSurface,
        );
      break;
    case 'bus':
      valid &&=
        s.loanedAt < at &&
        s.loanedAt < s.returnedAt &&
        !(
          s.driverImage === 'clear' &&
          (!s.spareKeyReturned || s.returnedAt > at)
        );
      break;
    case 'courier':
      valid &&= Number.isInteger(s.badge) && s.badge >= 100 && s.badge <= 999;
      break;
    case 'bank_call':
      valid &&=
        s.amount >= 200 &&
        s.amount <= 900 &&
        s.sessionStartedAt < at &&
        at < s.sessionEndedAt &&
        s.sessionEndedAt < s.withdrawnAt &&
        s.withdrawnAt < s.examinedAt &&
        ['exclusive', 'remote_session', 'shared_laptop'].includes(s.access);
      break;
    case 'charity':
      valid &&=
        s.amount >= 800 &&
        s.amount <= 3000 &&
        s.priorEventAt < at &&
        at < s.searchedAt &&
        s.tin >= 100 &&
        s.tin <= 999 &&
        ['continuous', 'prompted', 'partial'].includes(s.identification);
      break;
    case 'storage':
      valid &&=
        s.sceneSeal >= 1000 &&
        s.testedSeal >= 1000 &&
        at + 3 * minute < s.collectedAt &&
        s.collectedAt < s.receivedAt &&
        s.receivedAt < s.examinedAt &&
        ['physical_fit', 'same_fabric'].includes(s.comparison);
      break;
    case 'restaurant':
      valid &&= ['poured_fuel', 'competing_origins', 'undetermined'].includes(
        s.origin,
      );
      break;
  }
  if (!valid) throw new Error(`Invalid ${s.kind} facts, units, or chronology`);
}

export function renderScenario(s: Scenario): PrivateCase {
  validateScenario(s);
  const at = s.incidentAt;
  const t = time(at);
  if ('branch' in s) {
    const story = stories[s.kind];
    const values: Record<string, string> = {
      time: t,
      place: s.site,
      amount: money(s.amount),
      earlier: time(s.earlierAt),
      later: time(s.laterAt),
      previous: time(s.previousAt),
      week: time(s.weekAt),
      next: time(s.nextAt),
      lab: time(s.labAt),
    };
    const fill = (text: string) =>
      text.replace(/\{(\w+)\}/g, (_, key: string) => values[key]);
    const branchIndex = caseBranches.indexOf(s.branch);
    const review = reviewScenario(s);
    return {
      title: `${story.title} · ${s.site} #${s.reference}`,
      category: story.category,
      accusation: fill(story.accusation),
      evidence: story.evidence.map((exhibit) =>
        fill(typeof exhibit === 'string' ? exhibit : exhibit[branchIndex]),
      ),
      solution: review.reason,
      rubric: review.expectedVerdict
        ? 'Supported control: guilty is the authored expectation.'
        : 'Contested record: weigh both accounts; no fixed verdict expectation.',
      sampleDefense: review.conciseDefense,
    };
  }
  let accusation: string;
  let evidence: string[];
  switch (s.kind) {
    case 'workshop': {
      accusation = `You are accused of deliberately killing the victim with a metal bar at the ${s.site} repair workshop on ${t}.`;
      evidence = [
        `Emergency and medical records: the victim was found dead beside the workbench. The fatal head injuries correspond to the repeated bar strikes on the workshop recording.`,
        `Workshop camera, synchronized to dispatch time: on ${t}, a masked person repeatedly strikes the unarmed, retreating victim. The face is hidden. No earlier violence appears in the recording.`,
        `Corridor camera: the defendant enters at displayed ${time(s.entryAt + s.clockOffsetMinutes * minute)} and leaves at ${time(s.departureDisplay)}. The victim was alone before entry. Nobody else uses the only entrance before departure; the recording then ends.`,
        `Clock check: the corridor clock reads ${s.clockOffsetMinutes} minutes ahead of the workshop clock. ${s.clockErrorMinutes ? `That estimate may be wrong by up to ${s.clockErrorMinutes} minutes in either direction.` : 'Checks before and after the attack confirm that both clocks agree.'}`,
        `Witness statement: "The defendant came out in dark coveralls carrying something long and metal. I was across the yard." Tool records show that several workers used bars like the one recovered beside the victim.`,
      ];
      break;
    }
    case 'stairwell':
      accusation = `You are accused of deliberately pushing the victim down the stairs at ${s.site} flats on ${t}, causing their death.`;
      evidence = [
        `Medical and scene report: the victim died from injuries sustained in a fall down the stairwell. A silent silhouette recording shows one person using both hands to shove the retreating victim over the landing edge on ${t}.`,
        `First witness, from a window 35 metres away: "The landing lamp lit the attacker's face for a moment. I thought it was the defendant, a neighbor." The window gives a direct view but the glimpse lasted about a second.`,
        `Power log and scene survey: the landing lamp was off from ${time(at - 20 * minute)} until ${time(s.lightsRestoredAt)}. A battery exit sign stayed lit on the covered landing facing the witness’s window; its brightness was not measured.`,
        s.independentIdentification
          ? `Resident's original phone recording: from the landing doorway, a continuous close view clearly shows the defendant's face while they shove the victim, who is backing away with empty hands.`
          : `Second witness: "From the floor below I heard a voice I recognized as the defendant’s. Then the first witness called out that it was the defendant." The statement records no view of the push from that floor.`,
        `Caretaker's statement: the defendant lives in the building and argued with the victim about noise earlier that evening. Other residents used the same stairs. The caretaker did not witness the fall.`,
      ];
      break;
    case 'loading_dock':
      accusation = `You are accused of unlawfully attacking the injured worker at the ${s.site} loading dock on ${t}, causing a broken wrist.`;
      evidence = [
        `Clinic and ambulance records: the injured worker broke a wrist in a fall on ${t}. The dock recording clearly identifies both the defendant and the injured worker.`,
        `Complaint from the injured worker: "The defendant attacked me without warning. I had not touched or threatened them." The statement was taken after treatment.`,
        s.recording === 'complete_attack'
          ? `Original dock video: the uninterrupted minute before the fall shows the injured worker standing with empty hands. The defendant approaches, punches the injured worker, then deliberately pushes them onto the loading ramp.`
          : s.recording === 'disputed_force'
            ? `Original dock video: the injured worker swings a hook toward the defendant, then steps back and lowers it. About two seconds later the defendant pushes the worker onto the ramp. The hook remains in the worker’s hand; the view of their feet is blocked.`
            : `Exported dock clip: the file begins with the defendant pushing the injured worker, who falls. The original recorder failed; the preceding minute cannot be recovered. The worker is already moving backward as the visible push lands.`,
        s.recording === 'complete_attack'
          ? `Dispatch recording: "I can see the whole ramp. The defendant walked over and hit the injured worker; the injured worker was just standing there." The call begins before the fall.`
          : `Dispatch recording: "Someone is swinging a hook at the defendant by the gate. The defendant is trying to get away." The call begins just before the fall; the caller's view ends at the gate.`,
        `Supervisor's log: the defendant and the injured worker had disputed a shift assignment. Both were authorized to be at the dock. Police found a metal cargo hook at the gate and recorded no further violence after the fall.`,
      ];
      break;
    case 'station':
      accusation = `You are accused of deliberately striking an unthreatening passenger in the ${s.site} station passage on ${t}.`;
      evidence = [
        `Station camera and clinic record: an attacker strikes a passenger who is reading the departures board and causes a facial injury on ${t}. The overhead camera shows the act but not the attacker's face.`,
        `First witness: "I heard the impact, looked up from kiosk K, and saw the defendant’s face where the passenger was falling." The witness knows the defendant as a regular passenger. The distance from K was 30 metres.`,
        `Maintenance record and floor plan: a 1.5-metre screen stood between kiosk K and the attack location until ${time(s.barrierRemovedAt)}. It obscured hand movements at that position; a standing adult’s head could be seen above it.`,
        s.secondAccount === 'independent'
          ? `Platform camera: a separate continuous close view identifies the defendant entering the passage and striking the passenger, who neither approaches nor threatens the attacker.`
          : `Second witness: "A person in a dark coat moved toward the south exit just after the impact. The first witness then identified the defendant." The second witness was beside the stairs and described no facial features.`,
        `Concourse footage: the defendant was in the station shortly before the attack, wearing a dark coat. Several passengers wore similar coats. The passenger saw the blow too late to identify the attacker.`,
      ];
      break;
    case 'pharmacy': {
      const uncertain = s.journeyUncertaintyMinutes > 0;
      accusation = `You are accused of breaking into a pharmacy in ${s.site} on ${t} to steal prescription stock.`;
      evidence = [
        `Alarm and interior camera: on ${t}, a person forces a locked rear door, enters the closed pharmacy, fills a bag with stock, and leaves. The owner confirms the defendant had no permission to enter.`,
        `Owner, who knows the defendant: "I identify the defendant on the entry footage." ${uncertain ? 'The face is partly covered and the frame is blurred.' : 'The camera records the uncovered face under the entrance light.'} The original image is available.`,
        `Independent garage camera: the defendant leaves the staffed garage on foot on ${time(s.departureAt)}. The garage and pharmacy recorders were checked against the same time source.`,
        `Route reconstruction: a trial from the garage to the pharmacy took ${s.journeyMinutes} minutes${uncertain ? `; variations in waiting and route conditions give a range of ${s.journeyMinutes - s.journeyUncertaintyMinutes}–${s.journeyMinutes + s.journeyUncertaintyMinutes} minutes` : ', using routes and transport available that night'}. Both location recorders use the same time source.`,
        `Search on ${time(s.searchAt)}: stolen stock was in a used bag in a cupboard shared with a housemate. Print examination on ${time(s.examinedAt)} matched the defendant to the outer zipper; the inner wrapping yielded no usable print.`,
      ];
      break;
    }
    case 'jeweler':
      accusation = `You are accused of forcing entry to a jewelry workshop in ${s.site} on ${t} and breaking a safe to steal watches.`;
      evidence = [
        `Alarm, inventory, and entry camera: on ${t}, a masked intruder forces the closed workshop door and breaks the safe handle to take three serial-numbered watches. The defendant had no permission to enter that night.`,
        `Repair invoice and work photograph: the defendant serviced the intact safe on ${time(s.visitAt)}, touching the outer service panel and a loose pry tool. The handle was intact when the owner locked up before the burglary.`,
        `Print record: lifted on ${time(s.collectedAt)} from ${s.traceSurface === 'fresh_fracture' ? 'the inner face exposed by the broken handle' : s.traceSurface === 'service_panel' ? 'the outer panel beside the broken handle' : 'the loose pry tool'}. Collection photos confirm the location. Examination on ${time(s.examinedAt)} matches the defendant; the print's age is unknown.`,
        s.traceSurface === 'fresh_fracture'
          ? `Investigator's reconstruction: the printed inner face was sealed inside the handle until the break-in. A street camera places the defendant outside the workshop five minutes before the alarm.`
          : s.traceSurface === 'service_panel'
            ? `Evidence sheet and street recording: the lift location is entered as "handle assembly." The collection photograph shows the outer panel beside the break. A street camera places the defendant outside five minutes before the alarm.`
            : `Tool inventory and street recording: the pry tool stayed in the workshop after the repair. A street camera places the defendant near the workshop five minutes before the alarm; its view stops before the entrance.`,
        s.traceSurface === 'fresh_fracture'
          ? `Buyer's retained video call on ${time(s.offeredAt)}: the defendant offers a watch with a stolen serial number for cash. The buyer's copy clearly records the face, voice, and serial.`
          : `Sales-platform record on ${time(s.offeredAt)}: a stolen serial-numbered watch was offered from the defendant’s work laptop. A colleague also used the account and laptop. The listing shows the watch; no buyer met the seller.`,
      ];
      break;
    case 'bus':
      accusation = `You are accused of threatening a bus driver with a knife and taking the fare bag at ${s.site} on ${t}.`;
      evidence = [
        `Bus camera on ${t}: a person leaves van ${s.plate}, threatens the driver with a knife, takes the fare bag, and returns to the van. The recording is continuous.`,
        s.driverImage === 'clear'
          ? `Front camera: the robber’s uncovered face is clear during the threat and taking. The driver knows the defendant from working together and identifies them.`
          : `Driver’s statement: a hood partly hid the robber’s face. The driver recognized the defendant’s voice and profile from working together, but looked toward the knife during much of the encounter.`,
        `Vehicle record: van ${s.plate} belongs to the defendant. The same plate is clearly visible in the bus recording.`,
        s.driverImage === 'clear'
          ? `Police search on ${time(at + 30 * minute)}: the defendant is alone in the van with the driver’s numbered fare bag. The bag number matches the bus company’s record.`
          : `Loan messages: the defendant lent the van and its main key to a coworker on ${time(s.loanedAt)}. A return message is dated ${time(s.returnedAt)}.`,
        s.driverImage === 'clear'
          ? `Road cameras: the van leaves the bus stop and is followed through each junction to the police stop. Nobody enters or leaves it on that route.`
          : s.returnedAt > at
            ? `Key statements: the borrower held the main key through the robbery. The defendant retained a spare. Both could reach the parked van that evening; neither has a record showing who drove it.`
            : `Key statements: the borrower returned the van before the robbery but kept a spare key. Both could reach the parked van that evening; neither has a record showing who drove it.`,
      ];
      break;
    case 'courier':
      accusation = `You are accused of threatening the courier with a metal bar and taking a sealed parcel at the ${s.site} depot on ${t}.`;
      evidence = [
        `Depot video and courier statement: on ${t}, the person entering with badge ${s.badge} threatens the courier with a bar and takes the parcel. The video follows one person continuously from the badge reader to the courier.`,
        `Printed shift roster: badge ${s.badge} is assigned to the defendant. The roster was printed on ${time(at - 60 * minute)} and was the basis for naming the suspect.`,
        `Electronic roster: the supervisor changed badge ${s.badge} from the defendant to a coworker on ${time(s.badgeReassignedAt)}. Nobody recorded a physical handover. Staff kept the badges in an unlocked desk drawer.`,
        s.faceImage === 'clear'
          ? `Entrance camera: the badge user's face remains clear from entry through the taking. The supervisor, who works daily with the defendant, identifies the user as the defendant.`
          : `Entrance camera and supervisor statement: the cap hides part of the badge user’s face. The supervisor says the profile and build resemble the defendant, with whom they work daily. The camera records only one side of the face.`,
        `Parcel inventory and recovery record: the stolen serial-numbered parcel was found beneath the defendant’s workbench in the common loading bay. The bench has no lock; coworkers use that area between shifts. No handling trace was recovered.`,
      ];
      break;
    case 'bank_call':
      accusation = `You are accused of pretending to work for a bank in ${s.site} on ${t}, persuading a customer to send ${money(s.amount)} to your own account, and taking the money.`;
      evidence = [
        `Customer’s recording on ${t}: the caller says the savings are at risk and asks for a transfer to a "safe account." The customer sends ${money(s.amount)}. The bank confirms it sent no such instruction.`,
        `Bank records: the "safe account" belongs to the defendant. The customer’s ${money(s.amount)} arrives during the call. A withdrawal for the same amount uses the defendant’s bank card on ${time(s.withdrawnAt)}.`,
        `Laptop examination on ${time(s.examinedAt)}: an internet calling app’s saved log matches the scam call in the provider’s records. A saved document contains the customer’s details and the same "safe account" instructions.`,
        s.access === 'exclusive'
          ? `Laptop access: the defendant’s private login is open from ${time(s.sessionStartedAt)} to ${time(s.sessionEndedAt)}. The defendant confirms they alone had the laptop and bank card during that call.`
          : s.access === 'remote_session'
            ? `Support-app log: a housemate could control the laptop remotely from ${time(s.sessionStartedAt)} to ${time(s.sessionEndedAt)}. Earlier messages confirm that the housemate also borrowed the bank card and PIN for errands.`
            : `Household messages: the defendant and a housemate shared the laptop login and calling app. The defendant lent the housemate the bank card and PIN for errands the previous day.`,
        s.access === 'exclusive'
          ? `ATM footage on ${time(s.withdrawnAt)}: a clear view shows the defendant putting their bank card into the machine and collecting cash. The bank links that transaction to the withdrawal from the receiving account.`
          : `ATM footage on ${time(s.withdrawnAt)}: the person collecting the cash has the defendant’s build and a similar jacket. A cap hides their face. The bank links that transaction to the withdrawal from the receiving account.`,
      ];
      break;
    case 'charity':
      accusation = `You are accused of posing as an authorized hospital collector at the ${s.site} market on ${t}, obtaining ${money(s.amount)} from donors through that false claim and keeping it.`;
      evidence = [
        `Donor receipts and phone recording on ${t}: the collector says all cash in tin ${s.tin} will buy hospital equipment. Recorded receipts total ${money(s.amount)}. Donors say that promise caused them to give the cash.`,
        `Hospital records: the appeal and printed authorization letter are fabricated. The hospital authorized no collection that day and received none of the money. The letter carries a copied hospital logo and a signature its director denies making.`,
        s.identification === 'continuous'
          ? `Stall camera and vendor statement: continuous close footage identifies the defendant making the appeal, receiving the cash, and emptying the tin into a personal bag. The vendor has known the defendant for years.`
          : s.identification === 'prompted'
            ? `Donor interview: after a brief side view, the donor first described a jacket and build. The donor later saw the defendant's old hospital volunteer photograph online and then named the defendant. The stall camera shows a similar profile.`
            : `Vendor statement and stall camera: the vendor says the collector's jacket and build resemble the defendant's. A cap hides the upper face. The vendor saw the collector hold tin ${s.tin} and leave with it; the recording preserves that partial view.`,
        `Search on ${time(s.searchedAt)}: tin ${s.tin}, a badge like the collector's, and ${money(s.amount)} in cash were in the defendant's garage. A print lifted from the tin matches the defendant. The examiner cannot date when the print was left.`,
        s.identification === 'continuous'
          ? `Volunteer archive on ${time(s.priorEventAt)}: the defendant handled tin ${s.tin} at an earlier authorized event. The old badge was returned then. A print-shop receipt on ${time(at - day)} links the fabricated appeal letter and replacement badge to the defendant's order.`
          : `Volunteer archive on ${time(s.priorEventAt)}: the defendant and two volunteers handled tin ${s.tin}. The equipment then stayed in the garage; all three held keys. A group message shows a volunteer collecting a box there on the morning of the disputed appeal.`,
      ];
      break;
    case 'storage':
      accusation = `You are accused of deliberately starting a fire inside another person’s storage unit at ${s.site} on ${t}.`;
      evidence = [
        `Yard camera on ${t}: a masked person pours liquid inside the unit and lights it. Their coat catches on the door latch, leaving a torn piece of cloth.`,
        `Witness and police records: the defendant wore the seized coat on ${time(at - 5 * minute)} and ${time(at + 3 * minute)}. The defendant says they kept it on throughout. It has a fresh tear.`,
        `Collection record on ${time(s.collectedAt)}: after firefighters cleared the scene, an officer photographed the cloth on the latch and sealed it in bag ${s.sceneSeal}. The owner had forbidden any burning in the unit.`,
        s.testedSeal === s.sceneSeal
          ? `Laboratory intake on ${time(s.receivedAt)}: bag ${s.sceneSeal} arrived with its original seal intact. Its label and contents matched the collection photographs.`
          : `Laboratory intake on ${time(s.receivedAt)}: the officer says wet bag ${s.sceneSeal} was replaced by bag ${s.testedSeal}. A photograph shows cloth beside the scene label, but the old seal and a second officer’s signature are missing.`,
        `Cloth examination on ${time(s.examinedAt)}: ${s.comparison === 'physical_fit' ? `the torn edges of the cloth in bag ${s.testedSeal} fit the missing piece of the defendant’s coat` : `the cloth in bag ${s.testedSeal} has the same fabric and dye as the defendant’s coat. Many coats use that fabric; burning prevents comparison of the torn edges`}.`,
      ];
      break;
    case 'restaurant':
      accusation = `You are accused of deliberately setting fire to a closed restaurant in ${s.site} on ${t}.`;
      evidence = [
        `Fire service log: the fire began in the locked rear office on ${t}, damaging the restaurant. The alarm time agrees with the first visible smoke on the exterior recording.`,
        `Continuous entrance footage and scene plan: the defendant was the only person entering the office during the hour before ignition, leaving two minutes before the alarm. It has one door and sealed windows; the owner had locked it empty.`,
        s.origin === 'poured_fuel'
          ? `Origin examiner's report: a trail of poured fuel led from the office doorway to the burned desk; a used ignition match lay at its start. The electrical fault was confined to an isolated circuit and did not ignite the fire.`
          : s.origin === 'competing_origins'
            ? `Origin reports: examiner A places ignition beside the desk and notes solvent residue. Reviewer B places it at the faulty socket, beside solvent used for cleaning. Heat damage prevents either examiner from establishing when the circuit first arced.`
            : `Origin examiner's report: damage destroyed the decisive traces. Ignition could have begun at the faulty socket or beside the desk. Samples and circuit records cannot distinguish deliberate ignition from an electrical fire.`,
        `Maintenance ticket: the owner had reported a failing office socket that afternoon. Staff were told the fault would be inspected the next morning. The origin examiner reviewed the ticket and the recovered circuit.`,
        `Staff and search records: after dismissal the defendant said, "This place will go up in flames," then collected belongings. A fuel can was found in their car. A service receipt records fuel-powered garden equipment; nobody saw the defendant bring fuel inside.`,
      ];
      break;
  }
  const review = reviewScenario(s);
  return {
    title: `${catalog[s.kind].title} · ${s.site} #${s.reference}`,
    category: catalog[s.kind].category,
    accusation,
    evidence,
    solution: review.reason,
    rubric: `${review.expectedVerdict ? 'Supported control: guilty is the authored expectation.' : 'Contested record: evaluate both arguments; no fixed verdict expectation.'} Author's event account: ${review.truth}`,
    sampleDefense: review.conciseDefense,
  };
}

export function generateCase(
  recentTitles: string[] = [],
  seed = crypto.getRandomValues(new Uint32Array(1))[0],
): PrivateCase {
  const recent = recentTitles.slice(-12);
  const available = caseKinds.filter(
    (kind) =>
      !recent.some((title) => title.startsWith(`${catalog[kind].title} ·`)),
  );
  const roll = random(seed);
  const kind = available[roll(0, available.length - 1)];
  return renderScenario(createScenario(kind, roll(0, 0xffffffff)));
}
