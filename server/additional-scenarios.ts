// Additional factual mechanisms. Each has a sound and a flawed prosecution version.
export const additionalKinds = [
  'trace_age',
  'door_event',
  'mass',
  'dimensions',
  'temperature',
  'speed',
  'control_sample',
  'notice',
  'spending',
  'network',
  'sightline',
  'invoice',
  'cure_age',
  'backup',
  'concentration',
  'delivery',
] as const;
export type AdditionalKind = (typeof additionalKinds)[number];
export type AdditionalDetails =
  | { kind: 'trace_age'; crimeAt: number; cleanedAt: number; liftedAt: number }
  | {
      kind: 'door_event';
      at: number;
      resultCode: number;
      grantCode: number;
      crossings: number;
    }
  | {
      kind: 'mass';
      crates: number;
      netPerCrate: number;
      tare: number;
      received: number;
    }
  | { kind: 'dimensions'; cylinderMm: number; hatchCm: number }
  | { kind: 'temperature'; limitC: number; recordedF: number }
  | { kind: 'speed'; limitKph: number; metres: number; seconds: number }
  | { kind: 'control_sample'; threshold: number; sample: number; blank: number }
  | { kind: 'notice'; servedDay: number; delayDays: number; entryDay: number }
  | {
      kind: 'spending';
      cap: number;
      lineAmount: number;
      firstOrder: number;
      secondOrder: number;
    }
  | { kind: 'network'; port: number; ownHost: number; mappedHost: number }
  | { kind: 'sightline'; eyeCm: number; wallCm: number }
  | { kind: 'invoice'; base: number; taxPercent: number; charged: number }
  | {
      kind: 'cure_age';
      requiredDays: number;
      testedDays: number;
      requiredStrength: number;
      strength: number;
    }
  | { kind: 'backup'; createdAt: number; deletedAt: number; backupAt: number }
  | {
      kind: 'concentration';
      totalGrams: number;
      soluteGrams: number;
      limitPercent: number;
    }
  | {
      kind: 'delivery';
      size: number;
      received: number;
      eventCode: number;
      deliveredCode: number;
    };
type AdditionalScenario = AdditionalDetails & {
  site: string;
  day: string;
  mode: 'flawed' | 'consistent';
};
const time = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const money = (n: number) => `$${n.toLocaleString('en-US')}`;

export function createAdditional(
  kind: AdditionalKind,
  roll: (min: number, max: number) => number,
  at: number,
  flawed: boolean,
): AdditionalDetails {
  switch (kind) {
    case 'trace_age':
      return {
        kind,
        crimeAt: at,
        cleanedAt: at - 10,
        liftedAt: at + (flawed ? -20 : 10),
      };
    case 'door_event': {
      const grantCode = roll(40, 80);
      return {
        kind,
        at,
        grantCode,
        resultCode: grantCode + (flawed ? 1 : 0),
        crossings: flawed ? 0 : 1,
      };
    }
    case 'mass': {
      const crates = roll(2, 6),
        netPerCrate = roll(30, 80),
        tare = roll(3, 8);
      return {
        kind,
        crates,
        netPerCrate,
        tare,
        received: crates * (netPerCrate - (flawed ? 0 : tare)),
      };
    }
    case 'dimensions': {
      const hatchCm = roll(20, 50),
        difference = roll(10, 50);
      return {
        kind,
        hatchCm,
        cylinderMm: hatchCm * 10 + (flawed ? difference : -difference),
      };
    }
    case 'temperature': {
      const limitC = roll(4, 10),
        difference = roll(1, 3);
      return {
        kind,
        limitC,
        recordedF:
          Math.round(
            (32 + ((limitC + (flawed ? -difference : difference)) * 9) / 5) *
              10,
          ) / 10,
      };
    }
    case 'speed': {
      const limitKph = roll(4, 8) * 10,
        actual = limitKph + (flawed ? -10 : 10),
        factor = roll(2, 5);
      return {
        kind,
        limitKph,
        metres: actual * factor * 10,
        seconds: factor * 36,
      };
    }
    case 'control_sample':
      return {
        kind,
        threshold: 10,
        sample: roll(30, 90),
        blank: flawed ? roll(15, 25) : roll(0, 5),
      };
    case 'notice': {
      const servedDay = roll(1, 7),
        delayDays = roll(7, 14),
        gap = roll(1, 3);
      return {
        kind,
        servedDay,
        delayDays,
        entryDay: servedDay + delayDays + (flawed ? -gap : gap),
      };
    }
    case 'spending': {
      const cap = roll(2, 10) * 500,
        firstOrder = roll(1000, 8000);
      return {
        kind,
        cap,
        lineAmount: cap * 0.6,
        firstOrder,
        secondOrder: firstOrder + (flawed ? 1 : 0),
      };
    }
    case 'network': {
      const ownHost = roll(10, 200);
      return {
        kind,
        port: roll(30000, 60000),
        ownHost,
        mappedHost: ownHost + (flawed ? 1 : 0),
      };
    }
    case 'sightline': {
      const eyeCm = roll(150, 190),
        gap = roll(15, 40);
      return { kind, eyeCm, wallCm: eyeCm + (flawed ? gap : -gap) };
    }
    case 'invoice': {
      const base = roll(10, 90) * 100,
        taxPercent = roll(1, 5) * 5;
      return {
        kind,
        base,
        taxPercent,
        charged:
          (base * (100 + taxPercent)) / 100 + (flawed ? 0 : roll(1, 5) * 100),
      };
    }
    case 'cure_age': {
      const requiredStrength = roll(20, 50);
      return {
        kind,
        requiredDays: 28,
        testedDays: flawed ? roll(7, 21) : roll(28, 42),
        requiredStrength,
        strength: requiredStrength - roll(5, 10),
      };
    }
    case 'backup':
      return {
        kind,
        createdAt: at,
        deletedAt: at + 30,
        backupAt: at + (flawed ? 10 : -10),
      };
    case 'concentration': {
      const totalGrams = roll(1, 5) * 1000,
        limitPercent = roll(3, 10),
        actual = limitPercent + (flawed ? -2 : 2);
      return {
        kind,
        totalGrams,
        limitPercent,
        soluteGrams: (totalGrams * actual) / 100,
      };
    }
    case 'delivery': {
      const size = roll(300, 2000),
        deliveredCode = roll(40, 80);
      return {
        kind,
        size,
        deliveredCode,
        eventCode: deliveredCode + (flawed ? 1 : 0),
        received: flawed ? 0 : size,
      };
    }
  }
}

export function validateAdditional(s: AdditionalDetails): {
  valid: boolean;
  hasFlaw: boolean;
} {
  switch (s.kind) {
    case 'trace_age':
      return {
        valid: s.cleanedAt < s.crimeAt && s.liftedAt !== s.crimeAt,
        hasFlaw: s.liftedAt < s.cleanedAt,
      };
    case 'door_event':
      return {
        valid:
          [s.grantCode, s.grantCode + 1].includes(s.resultCode) &&
          s.crossings === (s.resultCode === s.grantCode ? 1 : 0),
        hasFlaw: s.crossings === 0,
      };
    case 'mass':
      return {
        valid:
          s.crates > 0 &&
          s.netPerCrate > s.tare &&
          s.received > 0 &&
          s.received <= s.crates * s.netPerCrate,
        hasFlaw: s.received === s.crates * s.netPerCrate,
      };
    case 'dimensions':
      return {
        valid: s.cylinderMm > 0 && s.hatchCm > 0,
        hasFlaw: s.cylinderMm > s.hatchCm * 10,
      };
    case 'temperature':
      return {
        valid: s.limitC > 0 && Number.isFinite(s.recordedF),
        hasFlaw: ((s.recordedF - 32) * 5) / 9 <= s.limitC,
      };
    case 'speed':
      return {
        valid: s.metres > 0 && s.seconds > 0 && s.limitKph > 0,
        hasFlaw: (s.metres / s.seconds) * 3.6 <= s.limitKph,
      };
    case 'control_sample':
      return {
        valid: s.sample >= s.threshold && s.blank >= 0 && s.threshold > 0,
        hasFlaw: s.blank >= s.threshold,
      };
    case 'notice':
      return {
        valid: s.delayDays > 0 && s.entryDay > s.servedDay && s.entryDay <= 28,
        hasFlaw: s.entryDay < s.servedDay + s.delayDays,
      };
    case 'spending':
      return {
        valid: s.cap > 0 && s.lineAmount < s.cap && 2 * s.lineAmount > s.cap,
        hasFlaw: s.firstOrder !== s.secondOrder,
      };
    case 'network':
      return {
        valid:
          s.port > 0 && s.port < 65536 && s.ownHost > 0 && s.mappedHost > 0,
        hasFlaw: s.ownHost !== s.mappedHost,
      };
    case 'sightline':
      return {
        valid: s.eyeCm > 0 && s.wallCm > 0,
        hasFlaw: s.wallCm >= s.eyeCm,
      };
    case 'invoice':
      return {
        valid: s.base > 0 && s.taxPercent > 0 && s.charged >= s.base,
        hasFlaw: s.charged === (s.base * (100 + s.taxPercent)) / 100,
      };
    case 'cure_age':
      return {
        valid:
          s.requiredDays > 0 &&
          s.testedDays > 0 &&
          s.strength > 0 &&
          s.strength < s.requiredStrength,
        hasFlaw: s.testedDays < s.requiredDays,
      };
    case 'backup':
      return {
        valid:
          s.createdAt < s.deletedAt &&
          s.backupAt < s.deletedAt &&
          s.backupAt !== s.createdAt,
        hasFlaw: s.backupAt > s.createdAt,
      };
    case 'concentration':
      return {
        valid:
          s.totalGrams > s.soluteGrams &&
          s.soluteGrams > 0 &&
          s.limitPercent > 0,
        hasFlaw: (100 * s.soluteGrams) / s.totalGrams <= s.limitPercent,
      };
    case 'delivery':
      return {
        valid:
          s.size > 0 &&
          [s.deliveredCode, s.deliveredCode + 1].includes(s.eventCode) &&
          s.received === (s.eventCode === s.deliveredCode ? s.size : 0),
        hasFlaw: s.received === 0,
      };
  }
}

export function renderAdditional(s: AdditionalScenario): {
  accusation: string;
  evidence: string[];
  solution: string;
  challenge: string;
} {
  const flawed = s.mode === 'flawed';
  let accusation: string,
    evidence: string[],
    solution: string,
    challenge: string;
  switch (s.kind) {
    case 'trace_age':
      accusation = `You are accused of forcing open a cash drawer at ${s.site} on ${s.day}. The prosecution relies on a fingerprint sample matched to you.`;
      evidence = [
        `A checked alarm records the forced opening at ${time(s.crimeAt)}. Staff immediately isolated the drawer until the forensic examination ended.`,
        `The recovery sheet timestamps the matched fingerprint lift at ${time(s.liftedAt)}. Its accession number matches the sample named in the laboratory report.`,
        `The drawer was professionally cleaned at ${time(s.cleanedAt)}. The verified procedure removed all existing prints before the later opening.`,
        'You handled the drawer during an earlier authorized shift. After cleaning, you had no permission to touch it; forensic staff used gloves.',
        'The laboratory identifies your fingerprint. The sample is the prosecution’s sole physical link to who forced the drawer during the alarm event.',
      ];
      solution = `The sample was lifted at ${time(s.liftedAt)}, cleaning occurred at ${time(s.cleanedAt)}, and the offense at ${time(s.crimeAt)}. ${flawed ? 'The recovered print predates both cleaning and the offense, so it cannot establish who forced the drawer later.' : 'The print was recovered after the post-cleaning forced opening; the earlier authorized handling does not explain it.'}`;
      challenge =
        'The recovery time shows this is an old fingerprint, collected before the cleaning and the alleged offense. Its later laboratory match does not date it to the crime.';
      break;
    case 'door_event':
      accusation = `You are accused of entering the restricted records room at ${s.site} on ${s.day}, despite a written access suspension.`;
      evidence = [
        `A lobby camera identifies you presenting your badge at the records-room reader at ${time(s.at)}.`,
        `The authenticated reader log records your badge with result code ${s.resultCode} for that event.`,
        `The controller manual defines code ${s.grantCode} as unlock granted and code ${s.grantCode + 1} as refused. A refused event leaves the lock engaged.`,
        `A checked passage sensor records ${s.crossings} inward crossings for the reader event. There was no other entry or tailgating in the charged interval.`,
        'You signed receipt of the suspension before this event. The allegation concerns completed entry at this time, not presenting the badge.',
      ];
      solution = `Code ${s.resultCode} means ${flawed ? 'refused' : 'unlock granted'}, and the sensor records ${s.crossings} crossings. ${flawed ? 'Presenting the badge did not result in the alleged entry.' : 'The camera, successful reader event, and crossing record establish entry during the suspension.'}`;
      challenge =
        'The event code means the reader refused access, and the passage record confirms I did not enter. A badge scan is not proof of completed entry.';
      break;
    case 'mass': {
      const expected = s.crates * s.netPerCrate,
        gross = s.crates * (s.netPerCrate + s.tare);
      accusation = `You are accused of delivering less material than you accepted for transport from ${s.site} on ${s.day}. The receiving figures are alleged to show a shortage.`;
      evidence = [
        `Dispatch records ${s.crates} loaded crates with combined gross mass ${gross} kg. Both scales involved were independently checked.`,
        `The packing certificate records ${s.tare} kg of empty packaging per crate. Gross mass includes that packaging; receiving net mass excludes it.`,
        `The receiver counted all ${s.crates} crates and recorded ${s.received} kg of contents after removing the packaging.`,
        `The signed supply order requires ${s.netPerCrate} kg of material per crate. No material was authorized for disposal or use in transit.`,
        'You signed sole custody for the journey. All containers were accounted for, and the scale and packing records cover the complete dispatch.',
      ];
      solution = `Gross ${gross} kg minus ${s.crates * s.tare} kg of packaging gives ${expected} kg of contents. Receipt records ${s.received} kg. ${flawed ? 'That matches the order; the gross/net distinction explains the supposed shortage.' : `A ${expected - s.received} kg shortage remains after accounting for all packaging.`}`;
      challenge =
        'The report compares gross dispatch weight with net receiving weight. Subtracting the crates’ packaging weight accounts for the whole apparent shortage.';
      break;
    }
    case 'dimensions':
      accusation = `You are accused of removing a rigid pressure cylinder through the service hatch at ${s.site} on ${s.day}. A witness says they saw you carry it through.`;
      evidence = [
        `The identified cylinder has a measured minimum passage diameter of ${s.cylinderMm} mm. An engineering inspection confirms that it cannot be compressed or disassembled.`,
        `The hatch's measured clear circular opening is ${s.hatchCm} cm. Its frame and opening remained unchanged throughout the incident.`,
        'The engineering report states that the cylinder needs an opening at least its minimum passage diameter in every possible orientation. One centimetre equals ten millimetres.',
        'The witness knows you and identifies both you and the cylinder’s serial marking. Their account specifically describes passage through this hatch.',
        'The hatch was the only route in the alleged removal. You had no release authorization for the cylinder.',
      ];
      solution = `The hatch is ${s.hatchCm * 10} mm across and the cylinder requires ${s.cylinderMm} mm. ${flawed ? 'The claimed passage is physically impossible under the inspection findings, undermining the witness account.' : 'The cylinder fits. The stated dimensions do not contradict the witness’s specific identification and account.'}`;
      challenge =
        'After converting centimetres to millimetres, the cylinder’s required passage diameter exceeds the hatch. The witness’s account describes an impossible removal.';
      break;
    case 'temperature': {
      const actual = Math.round((((s.recordedF - 32) * 5) / 9) * 10) / 10;
      accusation = `You are accused of storing a medicine shipment above its permitted temperature at ${s.site} on ${s.day}. You controlled the cold room during the recorded interval.`;
      evidence = [
        `The shipment specification permits a maximum temperature of ${s.limitC} degrees Celsius throughout storage.`,
        `The calibrated logger records ${s.recordedF.toFixed(1)} as the maximum during your custody. Its locked configuration identifies the scale as Fahrenheit.`,
        'The logger certificate gives the conversion: subtract 32 from Fahrenheit, then multiply by 5/9 to obtain Celsius.',
        'The logger measured the sealed medicine compartment continuously and passed both calibration checks. There were no unrecorded gaps or separate warmer compartments.',
        'Your signed shift record confirms sole control of the thermostat and acceptance of the shipment specification for this interval.',
      ];
      solution = `${s.recordedF.toFixed(1)} °F converts to ${actual} °C against a ${s.limitC} °C maximum. ${flawed ? 'The recorded maximum stays within the limit.' : 'The converted maximum exceeds the limit, even after correcting for units.'}`;
      challenge =
        'The logger is in Fahrenheit while the limit is Celsius. Converting the recorded maximum shows the shipment stayed within the permitted temperature.';
      break;
    }
    case 'speed': {
      const actual = (s.metres / s.seconds) * 3.6;
      accusation = `You are accused of exceeding the posted speed limit on a monitored road at ${s.site} on ${s.day}. The charge is based on the timed section average.`;
      evidence = [
        `The limit for the entire monitored section is ${s.limitKph} km/h. The applicable condition measures the average over this section.`,
        `A certified survey gives ${s.metres} metres between the two camera lines. There is one route between them.`,
        `Synchronized camera clocks record ${s.seconds} seconds between your vehicle crossing the first and second lines.`,
        'The measurement certificate specifies speed in km/h as distance in metres divided by elapsed seconds, multiplied by 3.6. All measurement checks passed.',
        'Both images clearly identify the same vehicle and you as its driver. No other speed measurement forms part of this charge.',
      ];
      solution = `${s.metres} ÷ ${s.seconds} × 3.6 gives ${actual} km/h. ${flawed ? 'That is below' : 'That exceeds'} the ${s.limitKph} km/h limit for the charged average.`;
      challenge =
        'Using the surveyed distance and the full elapsed time, the stated conversion gives an average below the posted limit.';
      break;
    }
    case 'control_sample':
      accusation = `You are accused of keeping a prohibited solvent in your work container at ${s.site} on ${s.day}. The allegation rests on one chemical test run.`;
      evidence = [
        `The laboratory reports ${s.sample} units in the sample from your individually marked container. The detection threshold is ${s.threshold} units.`,
        `The same run's preparation blank measured ${s.blank} units. It used fresh solvent and an empty container from the same preparation process.`,
        `The validated method accepts a run only when its blank is below ${s.threshold} units; otherwise preparation contamination prevents attributing a positive signal to the submitted sample.`,
        'The complete custody record links the submitted container to your locked workstation. Its use and storage were under your sole control.',
        'All other instrument checks passed. This run is the sole evidence of the prohibited chemical in your container.',
      ];
      solution = `The blank is ${s.blank} against a ${s.threshold}-unit acceptance threshold. ${flawed ? 'The method invalidates attribution from this contaminated preparation run.' : 'The control passes, while the securely attributed sample is positive above threshold.'}`;
      challenge =
        'The preparation blank fails the method’s acceptance limit. This run cannot distinguish a contaminated preparation process from a chemical in my submitted sample.';
      break;
    case 'notice': {
      const effective = s.servedDay + s.delayDays;
      accusation = `You are accused of entering the ${s.site} premises while your written site-access suspension was active.`;
      evidence = [
        `The served order is acknowledged by your signature on June ${s.servedDay}.`,
        `Its terms activate the suspension at 00:00 exactly ${s.delayDays} calendar days after the service date. Your existing access permission continues until that point.`,
        `The checked gate camera identifies you entering at noon on June ${s.entryDay}. You accept that the image is yours.`,
        'No earlier suspension, emergency exclusion, or other entry restriction applied. The order remained unamended through the recorded entry.',
        'The charge concerns entry while this order was effective. The prosecution relies on the served order and the gate record.',
      ];
      solution = `Service on June ${s.servedDay} plus ${s.delayDays} days makes the order effective on June ${effective}. Entry was June ${s.entryDay}, ${flawed ? 'before' : 'after'} activation. ${flawed ? 'The existing permission still applied.' : 'The suspension was active when you entered.'}`;
      challenge =
        'The activation clause starts the suspension several days after service. Calculating that date shows my recorded entry was still within my existing permission.';
      break;
    }
    case 'spending':
      accusation = `You are accused of exceeding your purchasing authority at ${s.site} on ${s.day} by approving two equipment lines.`;
      evidence = [
        `The written delegation permits you to approve up to ${money(s.cap)} per purchase order. Separate orders are assessed independently, with no combined daily cap.`,
        `The first approved line is ${money(s.lineAmount)} under purchase order ${s.firstOrder}. Your verified signature authorized it.`,
        `The second approved line is ${money(s.lineAmount)} under purchase order ${s.secondOrder}, also bearing your verified signature.`,
        'Each order total is the sum of its line amounts. The two exhibited lines are the complete set at issue, with no additional fees or amendments.',
        'Procurement confirms the orders came from independently permitted equipment requests. The only alleged violation is exceeding the stated per-order financial cap.',
      ];
      solution = `The two ${money(s.lineAmount)} lines ${flawed ? `belong to distinct orders ${s.firstOrder} and ${s.secondOrder}, each below the ${money(s.cap)} cap.` : `belong to order ${s.firstOrder}, totaling ${money(2 * s.lineAmount)} above the ${money(s.cap)} cap.`}`;
      challenge =
        'The policy applies per order, and these are separate orders. Each individual order remains within my delegated limit.';
      break;
    case 'network':
      accusation = `You are accused of transmitting a confidential design outside the ${s.site} office on ${s.day}. The prosecution traces the received file through the office network.`;
      evidence = [
        `The outside receiver records the exact confidential file arriving from the office's shared public address on source port ${s.port}.`,
        `The checked translation log maps that exact public address, port, and timestamp to workstation W-${s.mappedHost}. Entries uniquely identify connections.`,
        `The asset register assigns W-${s.ownHost} as your authenticated workstation. Each numbered workstation is a separate physical machine.`,
        `An authenticated console recording places you operating W-${s.ownHost} alone throughout the transfer interval. Remote control was disabled on all involved machines.`,
        'Staff at other workstations shared the public address. The design was confidential and no external transfer was authorized; the logs give the source-machine attribution.',
      ];
      solution = `The transfer maps to W-${s.mappedHost}; you are identified at W-${s.ownHost}. ${flawed ? 'The public address is shared and the specific connection maps to another machine.' : 'The connection and console recording link the transmission to the machine you alone operated.'}`;
      challenge =
        'The public address is shared. Following the exact source port through the translation log identifies a different workstation from the one I was operating.';
      break;
    case 'sightline':
      accusation = `You are accused of breaking a secured window at ${s.site} on ${s.day}. A witness says they recognized your face from a marked observation position.`;
      evidence = [
        `Surveyed face and eye positions are both ${s.eyeCm} cm above the same level ground, on opposite sides of a fixed wall.`,
        `The opaque wall measures ${s.wallCm} cm high and lies directly between those positions. It has no openings along the recorded sight line.`,
        'The reconstruction fixes both positions throughout the claimed recognition. Neither person changed elevation, and the record identifies no mirror or camera-assisted view.',
        'The witness knows you and says they saw your face as you deliberately struck the window. They identify this direct view as the basis of recognition.',
        'Damage inspection confirms a deliberate strike at that time. The witness account is the sole identification of the person who struck it.',
      ];
      solution = `The direct eye-to-face line is ${s.eyeCm} cm high; the wall is ${s.wallCm} cm. ${flawed ? 'The opaque wall blocks the claimed view.' : 'The direct view clears the wall, so its presence does not contradict the identification.'}`;
      challenge =
        'Combining the measured eye positions with the wall height shows an opaque barrier across the direct line of sight. The witness could not make the claimed recognition from there.';
      break;
    case 'invoice': {
      const allowed = (s.base * (100 + s.taxPercent)) / 100;
      accusation = `You are accused of billing a ${s.site} client beyond the agreed contract amount on ${s.day}. You personally issued the disputed invoice.`;
      evidence = [
        `The accepted quote states ${money(s.base)} before tax. It permits exactly ${s.taxPercent}% tax on that base and no additional charges.`,
        `Your signed invoice charges the client ${money(s.charged)} in total. The signature and issued copy are authenticated.`,
        `The contract's tax table specifies tax as base price multiplied by ${s.taxPercent}/100, added once to the base.`,
        'The client accepted all quoted work. There were no extra orders, discounts, fee amendments, or separate reimbursable expenses.',
        'The complaint compares the issued total with the agreed quote and tax terms. These are the complete financial terms for the charged invoice.',
      ];
      solution = `The agreed total is ${money(s.base)} plus ${s.taxPercent}% tax, or ${money(allowed)}. The invoice is ${money(s.charged)}. ${flawed ? 'It exactly matches the permitted total.' : `It exceeds the permitted total by ${money(s.charged - allowed)}.`}`;
      challenge =
        'The quote excludes tax. Adding the expressly permitted tax accounts for the whole difference between the base quote and the invoice.';
      break;
    }
    case 'cure_age':
      accusation = `You are accused of supplying a concrete batch below the contractual strength requirement for a ${s.site} project. The prosecution relies on the recorded specimen test.`;
      evidence = [
        `The signed specification requires at least ${s.requiredStrength} MPa from curing day ${s.requiredDays} onward. It sets no minimum for younger specimens.`,
        `The verified casting and testing dates place the sampled specimen at ${s.testedDays} days of age when tested.`,
        `The calibrated test records ${s.strength} MPa. Its sample identity matches the batch you mixed, supplied, and certified.`,
        'The agreed testing method treats specimens under the stated curing age as immature; their result cannot establish the later-age strength. Results from the required age onward assess compliance directly.',
        'The specimen received the agreed curing conditions and no later damage. This is the sole test offered to establish the charged shortfall.',
      ];
      solution = `The test age is ${s.testedDays} days against the ${s.requiredDays}-day applicability threshold. ${flawed ? 'The immature test cannot establish a violation of the later-age requirement.' : `The requirement applies, and ${s.strength} MPa is below ${s.requiredStrength} MPa.`}`;
      challenge =
        'The strength requirement applies only after the specified curing age. This specimen was tested too early to establish that the supplied batch violated it.';
      break;
    case 'backup':
      accusation = `You are accused of deleting a protected project file at ${s.site} on ${s.day} before it had a completed backup, contrary to the retention rule.`;
      evidence = [
        `The authenticated file log records creation of the protected file at ${time(s.createdAt)} and your deletion command at ${time(s.deletedAt)}. All logs use the same checked clock.`,
        `The sole completed backup is a point-in-time snapshot at ${time(s.backupAt)}. Its certification guarantees inclusion of every file existing at that instant.`,
        'The retention rule permits deleting a working file only after that exact file exists in a completed backup. Backup of earlier directory contents alone does not qualify.',
        'The file was neither renamed nor changed between creation and deletion. There were no other copies, exclusions, later snapshots, or backup failures.',
        'Your individual administrator credential and console recording authenticate the deletion. The allegation concerns whether the backup condition had been met.',
      ];
      solution = `The file was created at ${time(s.createdAt)}, the snapshot is from ${time(s.backupAt)}, and deletion occurred at ${time(s.deletedAt)}. ${flawed ? 'The completed snapshot includes the already-existing file, so deletion satisfied the stated condition.' : 'The snapshot predates creation and cannot contain the file; the deletion failed the stated condition.'}`;
      challenge =
        'The snapshot was completed after this file existed and before deletion. Its complete-contents certification therefore establishes the backup required by the retention rule.';
      break;
    case 'concentration': {
      const actual = (100 * s.soluteGrams) / s.totalGrams;
      accusation = `You are accused of storing a chemical mixture above the concentration allowed by the ${s.site} storage permit on ${s.day}.`;
      evidence = [
        `The permit allows a maximum ${s.limitPercent}% concentration by mass. It defines the percentage as chemical mass divided by total mixture mass, multiplied by 100.`,
        `The authenticated batch record shows ${s.soluteGrams} grams of pure chemical added to the vessel under your supervision.`,
        `After addition of water, the calibrated scale records ${s.totalGrams} grams of final mixture. The vessel's tare has already been excluded.`,
        'A verified mixing inspection confirms a uniform final mixture, with no separate concentrated layer, loss, or evaporation during storage.',
        'You signed responsibility for preparing and storing this batch. The permit applies to the final stored mixture rather than the incoming ingredient container.',
      ];
      solution = `${s.soluteGrams} ÷ ${s.totalGrams} × 100 gives ${actual}% by mass against the ${s.limitPercent}% limit. ${flawed ? 'The final mixture complies.' : 'The final mixture exceeds the limit despite dilution.'}`;
      challenge =
        'The permit applies to the diluted final mixture. Using the chemical mass and final mass in its percentage formula gives a concentration within the permitted limit.';
      break;
    }
    case 'delivery':
      accusation = `You are accused of delivering a confidential file to an outside recipient from ${s.site} on ${s.day}. The charge concerns a completed delivery in the audited interval.`;
      evidence = [
        `Your individual authenticated account initiated an outbound job for a ${s.size}-kilobyte confidential file. The destination was an outside recipient.`,
        `The complete job audit ends the charged interval with event code ${s.eventCode}. No later event occurs in that interval.`,
        `The protocol defines ${s.deliveredCode} as delivery acknowledged and ${s.deliveredCode + 1} as queued pending transmission. A queued job has not delivered any content.`,
        `The matched receiver log records ${s.received} kilobytes received for this job during the interval. These counters cover the entire job.`,
        'No release to that recipient was authorized. The initiating account and exact file identity are authenticated; the issue is whether the alleged delivery occurred.',
      ];
      solution = `The job ends with code ${s.eventCode} and ${s.received} kilobytes received. ${flawed ? 'The job remained queued and delivered no content during the charged interval.' : 'The protocol acknowledgment and full receiver count establish completed delivery.'}`;
      challenge =
        'The final audit code describes a queued job, and the receiver count confirms no content was delivered in the charged interval. Initiating the job does not establish completed delivery.';
      break;
  }
  return { accusation, evidence, solution, challenge };
}
