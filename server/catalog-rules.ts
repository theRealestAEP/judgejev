import { courtCatalog } from './case-catalog.ts';

export type CatalogKind = (typeof courtCatalog)[number]['kind'];
export const catalogKinds = courtCatalog.map((entry) => entry.kind);
export const catalogTitles = Object.fromEntries(
  courtCatalog.map((entry) => [entry.kind, entry.title]),
) as Record<CatalogKind, string>;
export function isCatalogKind(kind: string): kind is CatalogKind {
  return catalogKinds.includes(kind as CatalogKind);
}
export function catalogFamily(kind: CatalogKind) {
  return courtCatalog.find((entry) => entry.kind === kind)!.family;
}

type Facts =
  | { rule: 'rest'; start: number; end: number; minimum: number }
  | { rule: 'aggregate'; first: number; second: number; limit: number }
  | { rule: 'refund'; original: number; deducted: number; paid: number }
  | { rule: 'uncertainty'; reading: number; error: number; limit: number }
  | {
      rule: 'weighted';
      low: number;
      high: number;
      lowMass: number;
      highMass: number;
      limit: number;
    }
  | {
      rule: 'discount';
      base: number;
      firstPercent: number;
      secondPercent: number;
      charged: number;
    }
  | { rule: 'displacement'; capacity: number; occupied: number; load: number }
  | { rule: 'output'; cycles: number; perCycle: number; required: number }
  | {
      rule: 'allocation';
      ownShares: number;
      otherShares: number;
      total: number;
      charged: number;
    }
  | { rule: 'prerequisite'; passedAt: number; actedAt: number }
  | { rule: 'expiry'; expiresAt: number; actedAt: number }
  | { rule: 'scope'; firstAllowed: number; lastAllowed: number; used: number }
  | { rule: 'identity'; assigned: number; failed: number }
  | {
      rule: 'currency';
      foreign: number;
      rate: number;
      local: number;
      valuation: boolean;
    }
  | {
      rule: 'rollover';
      modulus: number;
      before: number;
      after: number;
      certified: number;
    }
  | {
      rule: 'window';
      at: number;
      window: number;
      first: number;
      second: number;
      maximum: number;
    }
  | {
      rule: 'retention';
      createdDay: number;
      closedDay: number;
      destroyedDay: number;
      minimum: number;
    }
  | {
      rule: 'quorum';
      first: number;
      second: number;
      third: number;
      required: number;
    }
  | {
      rule: 'interlock';
      firstReading: number;
      firstLimit: number;
      secondReading: number;
      secondLimit: number;
    };
export type CatalogDetails = { kind: CatalogKind; facts: Facts };
type CatalogScenario = CatalogDetails & {
  site: string;
  day: string;
  mode: 'flawed' | 'consistent';
};

export function createCatalog(
  kind: CatalogKind,
  roll: (min: number, max: number) => number,
  at: number,
  flawed: boolean,
): CatalogDetails {
  const gap = roll(3, 8);
  let facts: Facts;
  switch (catalogFamily(kind)) {
    case 'rest': {
      const minimum = roll(15, 40);
      facts = {
        rule: 'rest',
        start: at,
        end: at + minimum + (flawed ? gap : -gap),
        minimum,
      };
      break;
    }
    case 'aggregate': {
      const limit =
        kind === 'overtime_total' ? roll(20, 70) : roll(20, 70) * 10;
      const first = Math.floor((limit * roll(2, 5)) / 10);
      facts = {
        rule: 'aggregate',
        first,
        second: limit - first + (flawed ? -gap : gap),
        limit,
      };
      break;
    }
    case 'refund': {
      const original = roll(20, 80) * 100,
        deducted = roll(2, 10) * 100;
      facts = {
        rule: 'refund',
        original,
        deducted,
        paid: original - deducted + (flawed ? 0 : gap * 100),
      };
      break;
    }
    case 'uncertainty': {
      const limit = kind === 'noise_measurement' ? roll(60, 90) : roll(20, 80);
      facts = {
        rule: 'uncertainty',
        limit,
        reading: limit + gap,
        error: gap + (flawed ? 2 : -2),
      };
      break;
    }
    case 'weighted': {
      const scale =
        kind === 'blended_fuel' || kind === 'salinity_blend' ? 100 : 1;
      const low = roll(5, 15) / scale,
        mass = roll(5, 15) * 10;
      facts = {
        rule: 'weighted',
        low,
        high: low + 30 / scale,
        lowMass: mass * (flawed ? 4 : 1),
        highMass: mass * (flawed ? 1 : 4),
        limit: low + 15 / scale,
      };
      break;
    }
    case 'discount': {
      const base = roll(10, 99) * 1000,
        firstPercent = roll(1, 3) * 10,
        secondPercent = roll(1, 3) * 10;
      const price =
        (base * (100 - firstPercent) * (100 - secondPercent)) / 10000;
      facts = {
        rule: 'discount',
        base,
        firstPercent,
        secondPercent,
        charged: price + (flawed ? 0 : gap * 100),
      };
      break;
    }
    case 'displacement': {
      const capacity = roll(20, 70) * 10,
        occupied = roll(3, 8) * 10;
      facts = {
        rule: 'displacement',
        capacity,
        occupied,
        load: capacity - occupied + (flawed ? -gap : gap) * 10,
      };
      break;
    }
    case 'output': {
      const cycles = roll(20, 60),
        perCycle = roll(5, 15);
      facts = {
        rule: 'output',
        cycles,
        perCycle,
        required: (cycles + (flawed ? -gap : gap)) * perCycle,
      };
      break;
    }
    case 'allocation': {
      const ownShares = roll(2, 5),
        otherShares = roll(3, 8),
        perShare = roll(10, 50) * 100;
      facts = {
        rule: 'allocation',
        ownShares,
        otherShares,
        total: (ownShares + otherShares) * perShare,
        charged: ownShares * perShare + (flawed ? 0 : gap * 100),
      };
      break;
    }
    case 'prerequisite':
      facts = {
        rule: 'prerequisite',
        passedAt: at,
        actedAt: at + (flawed ? gap : -gap),
      };
      break;
    case 'expiry':
      facts = {
        rule: 'expiry',
        expiresAt: at,
        actedAt: at + (flawed ? -gap : gap),
      };
      break;
    case 'scope': {
      const firstAllowed = roll(10, 90);
      facts = {
        rule: 'scope',
        firstAllowed,
        lastAllowed: firstAllowed + 2,
        used: firstAllowed + (flawed ? 1 : 4),
      };
      break;
    }
    case 'identity': {
      const assigned = roll(1000, 8000);
      facts = {
        rule: 'identity',
        assigned,
        failed: assigned + (flawed ? 1 : 0),
      };
      break;
    }
    case 'currency': {
      const foreign = roll(20, 90) * 100,
        rate = roll(2, 5),
        valuation = kind === 'customs_conversion';
      facts = {
        rule: 'currency',
        foreign,
        rate,
        valuation,
        local: foreign * rate + (flawed ? 0 : gap * 100 * (valuation ? -1 : 1)),
      };
      break;
    }
    case 'rollover': {
      const modulus = 10000,
        before = roll(9800, 9900),
        after = roll(10, 90);
      facts = {
        rule: 'rollover',
        modulus,
        before,
        after,
        certified: modulus - before + after - (flawed ? 0 : gap * 10),
      };
      break;
    }
    case 'window': {
      const window = roll(20, 45);
      facts = {
        rule: 'window',
        at,
        window,
        first: at - window + (flawed ? -gap : gap),
        second: at - 5,
        maximum: 2,
      };
      break;
    }
    case 'retention': {
      const closedDay = roll(40, 80),
        minimum = roll(20, 60);
      facts = {
        rule: 'retention',
        createdDay: closedDay - roll(20, 35),
        closedDay,
        minimum,
        destroyedDay: closedDay + minimum + (flawed ? gap : -gap),
      };
      break;
    }
    case 'quorum': {
      const first = roll(100, 800);
      facts = {
        rule: 'quorum',
        first,
        second: first + 1,
        third: first + (flawed ? 2 : 1),
        required: 3,
      };
      break;
    }
    case 'interlock': {
      const firstLimit = roll(20, 50),
        secondLimit = kind === 'battery_dispatch' ? roll(30, 45) : roll(60, 90);
      facts = {
        rule: 'interlock',
        firstLimit,
        secondLimit,
        firstReading: firstLimit - gap,
        secondReading: secondLimit + (flawed ? -gap : gap),
      };
      break;
    }
  }
  return { kind, facts };
}

// The deciding relationship is calculated from facts, separately from their wording.
export function catalogHasFlaw(f: Facts): boolean {
  switch (f.rule) {
    case 'rest':
      return f.end - f.start >= f.minimum;
    case 'aggregate':
      return f.first + f.second <= f.limit;
    case 'refund':
      return f.paid <= f.original - f.deducted;
    case 'uncertainty':
      return f.reading - f.error <= f.limit;
    case 'weighted':
      return (
        f.low * f.lowMass + f.high * f.highMass <=
        f.limit * (f.lowMass + f.highMass)
      );
    case 'discount':
      return (
        f.charged * 10000 <=
        f.base * (100 - f.firstPercent) * (100 - f.secondPercent)
      );
    case 'displacement':
      return f.load + f.occupied <= f.capacity;
    case 'output':
      return f.cycles * f.perCycle >= f.required;
    case 'allocation':
      return f.charged * (f.ownShares + f.otherShares) <= f.total * f.ownShares;
    case 'prerequisite':
      return f.actedAt >= f.passedAt;
    case 'expiry':
      return f.actedAt < f.expiresAt;
    case 'scope':
      return f.used >= f.firstAllowed && f.used <= f.lastAllowed;
    case 'identity':
      return f.failed !== f.assigned;
    case 'currency':
      return f.valuation
        ? f.local >= f.foreign * f.rate
        : f.local <= f.foreign * f.rate;
    case 'rollover':
      return f.certified >= f.modulus - f.before + f.after;
    case 'window':
      return (
        [f.first, f.second, f.at].filter(
          (at) => at >= f.at - f.window && at <= f.at,
        ).length <= f.maximum
      );
    case 'retention':
      return f.destroyedDay - f.closedDay >= f.minimum;
    case 'quorum':
      return new Set([f.first, f.second, f.third]).size >= f.required;
    case 'interlock':
      return f.firstReading <= f.firstLimit && f.secondReading <= f.secondLimit;
  }
}

export function validateCatalog(s: CatalogScenario) {
  const f = s.facts;
  let valid =
    f.rule === catalogFamily(s.kind) &&
    Object.values(f).every(
      (v) => typeof v !== 'number' || (Number.isFinite(v) && v >= 0),
    );
  switch (f.rule) {
    case 'rest':
      valid &&= f.end > f.start && f.end < 1440 && f.minimum > 0;
      break;
    case 'aggregate':
      valid &&= f.first > 0 && f.second > 0 && f.limit > 0;
      break;
    case 'refund':
      valid &&= f.original > f.deducted && f.deducted > 0;
      break;
    case 'uncertainty':
      valid &&= f.reading > f.error && f.error > 0;
      break;
    case 'weighted':
      valid &&=
        f.low < f.high && f.high <= 100 && f.lowMass > 0 && f.highMass > 0;
      break;
    case 'discount':
      valid &&= f.base > 0 && f.firstPercent < 100 && f.secondPercent < 100;
      break;
    case 'displacement':
      valid &&= f.capacity > f.occupied && f.load > 0;
      break;
    case 'output':
      valid &&= f.cycles > 0 && f.perCycle > 0 && f.required > 0;
      break;
    case 'allocation':
      valid &&= f.ownShares > 0 && f.otherShares > 0 && f.total > 0;
      break;
    case 'prerequisite':
      valid &&= f.passedAt < 1440 && f.actedAt < 1440;
      break;
    case 'expiry':
      valid &&= f.expiresAt < 1440 && f.actedAt < 1440;
      break;
    case 'scope':
      valid &&= f.firstAllowed <= f.lastAllowed;
      break;
    case 'identity':
      valid &&= Number.isInteger(f.assigned) && Number.isInteger(f.failed);
      break;
    case 'currency':
      valid &&=
        f.rate > 0 &&
        f.foreign > 0 &&
        f.valuation === (s.kind === 'customs_conversion');
      break;
    case 'rollover':
      valid &&= f.before < f.modulus && f.after < f.before && f.certified > 0;
      break;
    case 'window':
      valid &&=
        f.first < f.second &&
        f.second < f.at &&
        f.window > 0 &&
        f.maximum === 2;
      break;
    case 'retention':
      valid &&=
        f.createdDay < f.closedDay &&
        f.closedDay < f.destroyedDay &&
        f.minimum > 0;
      break;
    case 'quorum':
      valid &&=
        f.required === 3 &&
        f.second === f.first + 1 &&
        (f.third === f.second || f.third === f.second + 1);
      break;
    case 'interlock':
      valid &&= f.firstLimit > 0 && f.secondLimit > 0;
      break;
  }
  if (!valid || catalogHasFlaw(f) !== (s.mode === 'flawed'))
    throw new Error(
      `Invalid ${s.kind} scenario: facts disagree with the intended case mode.`,
    );
}

const time = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const amount = (n: number) =>
  n.toLocaleString('en-US', { maximumFractionDigits: 2 });
export function renderCatalog(s: CatalogScenario) {
  const story = courtCatalog.find((entry) => entry.kind === s.kind)!;
  const f = s.facts,
    subject = story.subject,
    unit = story.unit;
  let evidence: string[], calculation: string, challenge: string;
  switch (f.rule) {
    case 'rest':
      evidence = [
        `The applicable site rule requires at least ${f.minimum} minutes for ${subject}, measured from its recorded start to its end.`,
        `The signed start log places the beginning of ${subject} at ${time(f.start)}.`,
        `The independently checked operations log places the end at ${time(f.end)}, when work resumed under your instruction.`,
        'Both timestamps refer to the same day and synchronized clocks. The interval was uninterrupted; no exemption or added waiting period applies.',
      ];
      calculation = `The interval is ${f.end - f.start} minutes; the minimum is ${f.minimum}.`;
      challenge =
        'The start and resumption records show that the complete required waiting interval elapsed.';
      break;
    case 'aggregate':
      evidence = [
        `The applicable limit for ${subject} is ${amount(f.limit)} ${unit}, including both recorded parts.`,
        `The first certified entry records ${amount(f.first)} ${unit}.`,
        `The second certified entry records ${amount(f.second)} ${unit}.`,
        'Both entries belong to the same allocation period or load. They are separate quantities; the applicable rule requires their sum and grants no extra allowance.',
      ];
      calculation = `The combined quantity is ${amount(f.first + f.second)} ${unit}, against a limit of ${amount(f.limit)}.`;
      challenge =
        'Adding the two certified quantities gives a total within the stated allowance.';
      break;
    case 'refund':
      evidence = [
        `The agreement limits the settlement of ${subject} to its original balance less accepted deductions.`,
        `The original balance was ${amount(f.original)} ${unit}.`,
        `Accepted deductions total ${amount(f.deducted)} ${unit}; the complete ledger records no other adjustment.`,
        `The bank confirmation records a settlement of ${amount(f.paid)} ${unit} under your signed payment instruction.`,
      ];
      calculation = `The remaining balance is ${amount(f.original - f.deducted)} ${unit}; the payment was ${amount(f.paid)}.`;
      challenge =
        'Subtracting the accepted deductions from the original balance gives the permitted payment, which covers the recorded amount.';
      break;
    case 'uncertainty':
      evidence = [
        `The applicable maximum for ${subject} is ${f.limit} ${unit}. The charge concerns the actual level, not merely the displayed reading.`,
        `The instrument displayed ${f.reading} ${unit} during the disputed event.`,
        `The calibration certificate places the true value within ${f.error} ${unit} above or below that reading. Every value in that interval remains possible on this evidence.`,
        'The calibration applies to this instrument and these conditions. The record contains no further correction or measurement that narrows the interval.',
      ];
      calculation = `The supported interval is ${f.reading - f.error}–${f.reading + f.error} ${unit}; the maximum is ${f.limit}.`;
      challenge =
        'The calibration interval includes values within the permitted limit, so the displayed number alone does not establish an exceedance.';
      break;
    case 'weighted':
      evidence = [
        `The certificate for ${subject} states that its final concentration is at most ${amount(f.limit)} percent by mass. This is the applicable acceptance limit.`,
        `The first batch weighs ${f.lowMass} kg and has a concentration of ${amount(f.low)} percent.`,
        `The second batch weighs ${f.highMass} kg and has a concentration of ${amount(f.high)} percent.`,
        'The accepted method multiplies each concentration by its batch mass, adds those products, and divides by the combined mass. These are the only batches.',
      ];
      calculation = `The mass-weighted concentration is ${amount((f.low * f.lowMass + f.high * f.highMass) / (f.lowMass + f.highMass))} percent; the maximum is ${amount(f.limit)}.`;
      challenge =
        'The batches have different masses. Weighting the two concentrations by those masses puts the final blend within the limit.';
      break;
    case 'discount': {
      const afterFirst = (f.base * (100 - f.firstPercent)) / 100;
      evidence = [
        `The agreed starting price for ${subject} is ${amount(f.base)} ${unit}.`,
        `The first discount is ${f.firstPercent} percent of that starting price.`,
        `The second discount is ${f.secondPercent} percent of the amount remaining after the first discount.`,
        `Your settled invoice charged ${amount(f.charged)} ${unit} for the complete purchase.`,
      ];
      calculation = `After the first discount: ${amount(afterFirst)}. After the second: ${amount((afterFirst * (100 - f.secondPercent)) / 100)}. Charged: ${amount(f.charged)}.`;
      challenge =
        'The second discount applies to the reduced balance. Applying the two discounts successively reconciles the agreed price with my invoice.';
      break;
    }
    case 'displacement':
      evidence = [
        `The certified internal volume of ${subject} is ${amount(f.capacity)} ${unit}.`,
        `Fixed equipment inside it occupies ${amount(f.occupied)} ${unit}, measured separately from the proposed load.`,
        `Your signed plan assigns a further ${amount(f.load)} ${unit} to the remaining space.`,
        'The applicable condition allows use of the entire remaining volume, including equality with capacity. All measurements are exact and use the same volume unit.',
      ];
      calculation = `Usable volume is ${amount(f.capacity - f.occupied)} ${unit}; the assigned load is ${amount(f.load)}.`;
      challenge =
        'Subtracting the fixed obstruction from the internal capacity still leaves enough volume for the assigned load.';
      break;
    case 'output':
      evidence = [
        `The signed requirement for ${subject} is at least ${amount(f.required)} ${unit}. Your certificate states that this requirement was met.`,
        `The complete run log records ${f.cycles} completed cycles or batches.`,
        `The verified manifest assigns ${f.perCycle} ${unit} to every completed cycle or batch.`,
        'All listed output belongs to this run. The quantity is the number of completed cycles multiplied by their verified output, with no carryover from an earlier run.',
      ];
      calculation = `Output is ${f.cycles} × ${f.perCycle} = ${amount(f.cycles * f.perCycle)} ${unit}; the requirement is ${amount(f.required)}.`;
      challenge =
        'Multiplying the completed cycle count by the verified output per cycle shows the required quantity was produced.';
      break;
    case 'allocation':
      evidence = [
        `The complete cost of ${subject} is ${amount(f.total)} ${unit}.`,
        `The billed party holds ${f.ownShares} cost shares; all other parties together hold ${f.otherShares} shares.`,
        'The signed allocation rule divides the complete cost by the total number of shares, then multiplies that result by the billed party’s shares.',
        `The paid bill you issued to that party was ${amount(f.charged)} ${unit}.`,
      ];
      calculation = `The permitted share is ${amount((f.total * f.ownShares) / (f.ownShares + f.otherShares))} ${unit}; the bill is ${amount(f.charged)}.`;
      challenge =
        'The denominator includes both this party’s shares and the other parties’ shares. Applying that fraction reconciles the bill.';
      break;
    case 'prerequisite':
      evidence = [
        `The governing condition allows ${subject} only once the named verification has passed. Completion of the test alone is insufficient.`,
        `The verification started at ${time(f.passedAt - 20)} and its result changed to PASSED at ${time(f.passedAt)}.`,
        `Your authenticated action record places ${subject} at ${time(f.actedAt)}.`,
        'The logs use synchronized clocks on the same day. The passing result became effective immediately, remained valid, and is the only prerequisite at issue.',
      ];
      calculation = `Verification passed at ${time(f.passedAt)}; the action occurred at ${time(f.actedAt)}.`;
      challenge =
        'The passing result was already effective when I acted. The actual action time follows the required clearance.';
      break;
    case 'expiry':
      evidence = [
        `The authority register states that permission for ${subject} expires at ${time(f.expiresAt)} that day. It is valid before that instant.`,
        `The event log places ${subject} at ${time(f.actedAt)}.`,
        `The investigator downloaded the permission record at ${time(f.expiresAt + 30)}. Its status at download was EXPIRED.`,
        'The permission was valid from the start of the day until its stated expiry, without suspension or renewal. All recorded times use the same checked clock.',
      ];
      calculation = `The action at ${time(f.actedAt)} must be compared with expiry at ${time(f.expiresAt)}, rather than the later download status.`;
      challenge =
        'The investigator saw an expired status later. At the actual time of the activity, the permission was still valid.';
      break;
    case 'scope':
      evidence = [
        `Your valid written permission covers ${unit} numbers ${f.firstAllowed} through ${f.lastAllowed}, inclusive, for ${subject}.`,
        `The checked event record assigns your activity to ${unit} ${f.used}.`,
        `An investigator’s summary mentions only ${unit} ${f.firstAllowed}, quoting the first number in the permission.`,
        'The original permission is complete and authentic. Every integer identifier within its inclusive range is covered, with no exclusions or later amendments.',
      ];
      calculation = `Identifier ${f.used} is compared with the inclusive permitted range ${f.firstAllowed}–${f.lastAllowed}.`;
      challenge =
        'The permission covers an inclusive range, not just the first identifier quoted in the summary. My recorded activity falls within that range.';
      break;
    case 'identity':
      evidence = [
        `The assignment register places ${subject} ID ${f.assigned} in your custody for this job.`,
        `The inspection report marks ${unit} ID ${f.failed} as FAILED and prohibits release, installation, or acceptance of that specific item.`,
        `Your signed action record names item ID ${f.assigned}. It matches your assignment record exactly.`,
        'Identifiers are unique, permanent, and read without uncertainty. Only an item with a recorded failed inspection is barred under the condition at issue; there is no separate missing-test charge.',
      ];
      calculation = `Your item is ${f.assigned}; the failed inspection identifies ${f.failed}.`;
      challenge =
        'The failed inspection names a different permanent identifier from the item assigned to me and recorded in my action.';
      break;
    case 'currency':
      evidence = [
        `The foreign-currency amount for ${subject} is ${amount(f.foreign)} foreign dollars.`,
        `The binding rate is ${f.rate} local dollars for each foreign dollar. The rate direction is explicitly stated in the agreement.`,
        `Your signed record ${f.valuation ? 'declares a value of' : 'collects'} ${amount(f.local)} local dollars.`,
        `The applicable condition requires ${f.valuation ? 'a declared value at least equal to' : 'collection no greater than'} the foreign amount converted at that rate. No rounding is required for these amounts.`,
      ];
      calculation = `The conversion is ${amount(f.foreign)} × ${f.rate} = ${amount(f.foreign * f.rate)} local dollars; your record states ${amount(f.local)}.`;
      challenge =
        'The rate is local dollars per foreign dollar. Multiplying in that direction reconciles my recorded amount with the required conversion.';
      break;
    case 'rollover':
      evidence = [
        `The register for ${subject} showed ${String(f.before).padStart(4, '0')} at the beginning of the reporting interval.`,
        `At the end it showed ${String(f.after).padStart(4, '0')}. A separate rollover flag records exactly one wrap through zero.`,
        `The register advances from ${f.modulus - 1} to 0000 on its next unit. It displays only the last four digits.`,
        `Your signed return certifies ${f.certified} ${unit}. The condition requires reporting at least the full forward count during this interval.`,
      ];
      calculation = `The forward count is ${f.modulus} − ${f.before} + ${f.after} = ${f.modulus - f.before + f.after} ${unit}; certified: ${f.certified}.`;
      challenge =
        'The register wrapped through zero exactly once. Accounting for that rollover gives the quantity stated in my return.';
      break;
    case 'window':
      evidence = [
        `The permit allows at most ${f.maximum} ${unit} in any rolling ${f.window}-minute interval, counting both endpoints.`,
        `The complete event log for ${subject} lists events at ${time(f.first)}, ${time(f.second)}, and ${time(f.at)} that day.`,
        `The complaint evaluates the interval ending at ${time(f.at)} and counts all three listed events against you.`,
        'All timestamps use the same checked clock. There are no other events near this interval, and the charge concerns only the stated rolling limit.',
      ];
      calculation = `The evaluated interval begins at ${time(f.at - f.window)}. The earliest listed event is at ${time(f.first)}; the other two fall inside.`;
      challenge =
        'The earliest listed event falls before the rolling interval begins. Only two qualifying events belong in the charged window.';
      break;
    case 'retention':
      evidence = [
        `The retention rule for ${subject} runs for ${f.minimum} full days from formal closure or withdrawal, not from record creation.`,
        `The archive dates creation to day ${f.createdDay} and formal closure or withdrawal to day ${f.closedDay}.`,
        `Your signed destruction order was carried out on day ${f.destroyedDay}.`,
        'Day numbers count elapsed whole days from the same archive origin. Destruction is allowed once the required number of days has elapsed; no hold or extension applied.',
      ];
      calculation = `Retention after closure was ${f.destroyedDay - f.closedDay} days; the requirement is ${f.minimum}.`;
      challenge =
        'Using formal closure as the starting point still gives the complete required retention period before destruction.';
      break;
    case 'quorum':
      evidence = [
        `The governing rule requires approval by ${f.required} distinct authorized people before implementing ${subject}. Multiple approvals from one person count once.`,
        `Before implementation, the first signed approval carried person ID ${f.first}; the second carries person ID ${f.second}.`,
        `The third signed approval carries person ID ${f.third}. It was received before implementation.`,
        `The complete eligibility register authorizes person IDs ${f.first}, ${f.first + 1}, and ${f.first + 2}. Signatures are genuine; IDs identify people rather than documents.`,
      ];
      calculation = `There are ${new Set([f.first, f.second, f.third]).size} distinct eligible approvers; the rule requires ${f.required}.`;
      challenge =
        'The signatures belong to three distinct authorized people. Counting the person identifiers establishes the required quorum.';
      break;
    case 'interlock': {
      const [firstName, secondName] =
        s.kind === 'pressure_vessel'
          ? ['chamber pressure in kPa', 'chamber temperature in °C']
          : s.kind === 'battery_dispatch'
            ? ['state of charge in percent', 'case temperature in °C']
            : s.kind === 'gas_transfer'
              ? ['supply pressure in kPa', 'receiving tank fill in percent']
              : ['internal temperature in °C', 'carbon monoxide in ppm'];
      evidence = [
        `The operating condition for ${subject} requires BOTH ${firstName} at or below ${f.firstLimit} and ${secondName} at or below ${f.secondLimit}.`,
        `The event record gives ${firstName} as ${f.firstReading}.`,
        `The same record gives ${secondName} as ${f.secondReading}.`,
        'The readings are exact and use the same units as their respective limits. Each limit applies to its own diagnostic; neither reading replaces or offsets the other.',
      ];
      calculation = `${firstName} is ${f.firstReading} against ${f.firstLimit}; ${secondName} is ${f.secondReading} against ${f.secondLimit}. Both limits must be met.`;
      challenge =
        'Each measurement meets its own limit, so both required conditions were satisfied at the moment I acted.';
      break;
    }
  }
  return {
    accusation: `You are accused of ${story.charge} at ${s.site} on ${s.day}. The disputed record concerns ${subject}.`,
    evidence: [...evidence, story.context],
    solution: `${calculation} ${s.mode === 'flawed' ? 'The records leave a material weakness in the stated charge.' : 'The records support the specific breach alleged in the charge.'}`,
    challenge,
  };
}
