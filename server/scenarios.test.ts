import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  caseKinds,
  createScenario,
  generateCase,
  renderScenario,
  validateScenario,
  type CaseMode,
} from './scenarios.ts';
import { parseCase, publicCase } from './game.ts';
import { courtCatalog } from './case-catalog.ts';
import {
  catalogFamily,
  catalogHasFlaw,
  isCatalogKind,
} from './catalog-rules.ts';

void test('200,000 seeded cases satisfy both prosecution modes and the five-exhibit contract', () => {
  for (const kind of caseKinds) {
    for (const mode of ['flawed', 'consistent'] as const) {
      const uniqueCases = new Set<string>();
      const uniqueEvidence = new Set<string>();
      for (let seed = 0; seed < 1000; seed++) {
        const s = createScenario(kind, seed, mode);
        const file = renderScenario(s);
        assert.deepEqual(parseCase(file), file);
        assert.equal(file.evidence.length, 5);
        assert.equal(
          file.evidence.some((text) => /undefined|NaN/.test(text)),
          false,
        );
        uniqueEvidence.add([...file.evidence].sort().join('\n'));
        uniqueCases.add(file.accusation + [...file.evidence].sort().join('\n'));
        // Independently calculate whether the key records undermine the charge.
        let undermines: boolean;
        switch (s.kind) {
          case 'clock':
            undermines = s.displayed - s.fastBy < s.theftStart;
            break;
          case 'travel':
            undermines = s.minimumJourney > s.theftEnd - s.seen;
            break;
          case 'visibility':
            undermines =
              s.identified >= s.outageStart && s.identified < s.outageEnd;
            break;
          case 'access':
            undermines = s.at < s.revokedAt;
            break;
          case 'ledger':
            undermines =
              s.bankTotal === s.transactions * s.payment &&
              s.transactionId === s.secondTransactionId;
            break;
          case 'vehicle':
            undermines = s.at > s.plateChangedAt;
            break;
          case 'custody':
            undermines = s.intermediateSeal !== s.labSourceSeal;
            break;
          case 'revision':
            undermines =
              s.signedVersion === s.originalVersion &&
              s.signedAt < s.feeRemovedAt;
            break;
          case 'trace_age':
            undermines = s.liftedAt < s.cleanedAt;
            break;
          case 'door_event':
            undermines = s.crossings === 0 && s.resultCode !== s.grantCode;
            break;
          case 'mass':
            undermines = s.received / s.crates === s.netPerCrate;
            break;
          case 'dimensions':
            undermines = s.cylinderMm / 10 > s.hatchCm;
            break;
          case 'temperature':
            undermines = s.recordedF <= (s.limitC * 9) / 5 + 32;
            break;
          case 'speed':
            undermines = s.metres * 3600 <= s.limitKph * 1000 * s.seconds;
            break;
          case 'control_sample':
            undermines = s.blank >= s.threshold;
            break;
          case 'notice':
            undermines = s.entryDay - s.servedDay < s.delayDays;
            break;
          case 'spending':
            undermines = s.firstOrder !== s.secondOrder;
            break;
          case 'network':
            undermines = s.ownHost !== s.mappedHost;
            break;
          case 'sightline':
            undermines = s.eyeCm <= s.wallCm;
            break;
          case 'invoice':
            undermines = s.charged - s.base === (s.base * s.taxPercent) / 100;
            break;
          case 'cure_age':
            undermines = s.testedDays < s.requiredDays;
            break;
          case 'backup':
            undermines = s.createdAt < s.backupAt && s.backupAt < s.deletedAt;
            break;
          case 'concentration':
            undermines = s.soluteGrams * 100 <= s.limitPercent * s.totalGrams;
            break;
          case 'delivery':
            undermines = s.received === 0 && s.eventCode !== s.deliveredCode;
            break;
          default: {
            const f = s.facts;
            switch (f.rule) {
              case 'rest':
                undermines = f.start + f.minimum <= f.end;
                break;
              case 'aggregate':
                undermines = f.limit - f.first >= f.second;
                break;
              case 'refund':
                undermines = f.paid + f.deducted <= f.original;
                break;
              case 'uncertainty':
                undermines = f.error >= f.reading - f.limit;
                break;
              case 'weighted':
                undermines =
                  (f.lowMass / (f.lowMass + f.highMass)) * f.low +
                    (f.highMass / (f.lowMass + f.highMass)) * f.high <=
                  f.limit;
                break;
              case 'discount':
                undermines =
                  f.base -
                    (f.base * f.firstPercent) / 100 -
                    ((f.base - (f.base * f.firstPercent) / 100) *
                      f.secondPercent) /
                      100 >=
                  f.charged;
                break;
              case 'displacement':
                undermines = f.capacity - f.load >= f.occupied;
                break;
              case 'output':
                undermines = f.cycles >= f.required / f.perCycle;
                break;
              case 'allocation':
                undermines =
                  (f.total / (f.ownShares + f.otherShares)) * f.ownShares >=
                  f.charged;
                break;
              case 'prerequisite':
                undermines = f.actedAt - f.passedAt >= 0;
                break;
              case 'expiry':
                undermines = f.expiresAt - f.actedAt > 0;
                break;
              case 'scope':
                undermines = Array.from(
                  { length: f.lastAllowed - f.firstAllowed + 1 },
                  (_, i) => f.firstAllowed + i,
                ).includes(f.used);
                break;
              case 'identity':
                undermines = f.assigned - f.failed !== 0;
                break;
              case 'currency':
                undermines = f.valuation
                  ? f.local / f.rate >= f.foreign
                  : f.local / f.rate <= f.foreign;
                break;
              case 'rollover':
                undermines = f.certified + f.before - f.after >= f.modulus;
                break;
              case 'window':
                undermines = f.at - f.first > f.window;
                break;
              case 'retention':
                undermines = f.closedDay + f.minimum <= f.destroyedDay;
                break;
              case 'quorum':
                undermines =
                  f.first !== f.second &&
                  f.first !== f.third &&
                  f.second !== f.third;
                break;
              case 'interlock':
                undermines = !(
                  f.firstReading > f.firstLimit ||
                  f.secondReading > f.secondLimit
                );
                break;
            }
          }
        }
        assert.equal(undermines, mode === 'flawed', `${kind} seed ${seed}`);
      }
      assert.ok(
        uniqueEvidence.size > 10,
        `${kind}/${mode}: evidence must vary`,
      );
      assert.ok(
        uniqueCases.size > 700,
        `${kind}/${mode}: ${uniqueCases.size} distinct public cases`,
      );
    }
  }
});

void test('case validators reject a private classification that contradicts the facts', () => {
  for (const kind of caseKinds) {
    for (const mode of ['flawed', 'consistent'] as const) {
      const scenario = createScenario(kind, 1976, mode);
      const invalid = {
        ...scenario,
        mode: (mode === 'flawed' ? 'consistent' : 'flawed') as CaseMode,
      };
      assert.throws(() => validateScenario(invalid), /intended case mode/);
      assert.throws(() => renderScenario(invalid), /intended case mode/);
    }
  }
});

void test('paired cases share titles and challenge wording while changing critical facts', () => {
  for (const kind of caseKinds) {
    const flawed = renderScenario(createScenario(kind, 42, 'flawed'));
    const consistent = renderScenario(createScenario(kind, 42, 'consistent'));
    assert.equal(flawed.title, consistent.title);
    assert.equal(flawed.category, consistent.category);
    assert.equal(flawed.sampleDefense, consistent.sampleDefense);
    assert.notDeepEqual(flawed.evidence, consistent.evidence);
    assert.deepEqual(Object.keys(publicCase(flawed)).sort(), [
      'accusation',
      'category',
      'evidence',
      'title',
    ]);
    assert.deepEqual(Object.keys(publicCase(consistent)).sort(), [
      'accusation',
      'category',
      'evidence',
      'title',
    ]);
  }
});

void test('random draws include both modes for every pattern', () => {
  for (const kind of caseKinds) {
    let flawed = 0;
    for (let seed = 0; seed < 2000; seed++) {
      if (createScenario(kind, seed).mode === 'flawed') flawed++;
    }
    assert.ok(flawed > 850 && flawed < 1150, `${kind}: ${flawed}/2000 flawed`);
  }
});

void test('seeds reproduce cases and vary the order of the five exhibits', () => {
  const orders = new Set<number>();
  for (let seed = 0; seed < 50; seed++) {
    const scenario = createScenario('clock', seed);
    assert.deepEqual(
      renderScenario(scenario),
      renderScenario(createScenario('clock', seed)),
    );
    orders.add(
      renderScenario(scenario).evidence.findIndex((text) =>
        text.startsWith('At a calibration'),
      ),
    );
  }
  assert.equal(orders.size, 5);
  assert.deepEqual(generateCase([], 42), generateCase([], 42));
});

void test('ongoing rounds avoid the last twelve stories and last three rule families', () => {
  let recent: string[] = [];
  const all = new Set<string>();
  const families: string[] = [];
  for (let seed = 0; seed < 1000; seed++) {
    const file = generateCase(recent, Math.imul(seed + 1, 2654435761) >>> 0);
    const mechanism = file.title.split(' ·')[0];
    assert.ok(
      recent.slice(-12).every((title) => title.split(' ·')[0] !== mechanism),
    );
    const entry = courtCatalog.find((entry) => entry.title === mechanism);
    const family = entry?.family ?? mechanism;
    assert.ok(!families.slice(-3).includes(family));
    families.push(family);
    all.add(mechanism);
    recent = [...recent, file.title].slice(-12);
  }
  assert.equal(all.size, caseKinds.length);
});

void test('the catalog contains 100 distinct stories with four setups per new rule family', () => {
  assert.equal(caseKinds.length, 100);
  assert.equal(new Set(caseKinds).size, 100);
  const files = caseKinds.map((kind) =>
    renderScenario(createScenario(kind, 42)),
  );
  assert.equal(new Set(files.map((file) => file.title)).size, 100);
  assert.equal(new Set(files.map((file) => file.accusation)).size, 100);
  assert.equal(new Set(courtCatalog.map((entry) => entry.context)).size, 76);
  const families = new Map<string, number>();
  for (const kind of caseKinds) {
    if (!isCatalogKind(kind)) continue;
    const family = catalogFamily(kind);
    families.set(family, (families.get(family) ?? 0) + 1);
  }
  assert.equal(families.size, 19);
  assert.ok([...families.values()].every((count) => count === 4));
});

void test('rule boundaries agree with inclusive limits and explicit expiry semantics', () => {
  assert.equal(
    catalogHasFlaw({ rule: 'rest', start: 600, end: 630, minimum: 30 }),
    true,
  );
  assert.equal(
    catalogHasFlaw({ rule: 'expiry', actedAt: 600, expiresAt: 600 }),
    false,
  );
  assert.equal(
    catalogHasFlaw({ rule: 'prerequisite', actedAt: 600, passedAt: 600 }),
    true,
  );
  assert.equal(
    catalogHasFlaw({ rule: 'uncertainty', reading: 55, error: 5, limit: 50 }),
    true,
  );
  assert.equal(
    catalogHasFlaw({ rule: 'uncertainty', reading: 55, error: 4, limit: 50 }),
    false,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'scope',
      firstAllowed: 10,
      lastAllowed: 12,
      used: 12,
    }),
    true,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'scope',
      firstAllowed: 10,
      lastAllowed: 12,
      used: 13,
    }),
    false,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'window',
      at: 600,
      window: 30,
      first: 570,
      second: 590,
      maximum: 2,
    }),
    false,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'window',
      at: 600,
      window: 30,
      first: 569,
      second: 590,
      maximum: 2,
    }),
    true,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'retention',
      createdDay: 10,
      closedDay: 20,
      destroyedDay: 50,
      minimum: 30,
    }),
    true,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'interlock',
      firstReading: 20,
      firstLimit: 20,
      secondReading: 30,
      secondLimit: 30,
    }),
    true,
  );
  assert.equal(
    catalogHasFlaw({
      rule: 'interlock',
      firstReading: 10,
      firstLimit: 20,
      secondReading: 31,
      secondLimit: 30,
    }),
    false,
  );
});
