import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  caseKinds,
  caseBranches,
  catalog,
  createScenario,
  generateCase,
  renderScenario,
  reviewScenario,
  validateScenario,
  time,
} from './scenarios.ts';
import { parseCase, publicCase, judgeDefense, sealCase } from './game.ts';

void test('36,000 cases have valid facts, five sourced neutral exhibits, and supported controls and contested public records', () => {
  for (const kind of caseKinds) {
    for (const branch of caseBranches) {
      const records = new Set<string>();
      for (let seed = 0; seed < 1000; seed++) {
        const s = createScenario(kind, seed, branch);
        const file = renderScenario(s);
        const review = reviewScenario(s);
        assert.ok(file.accusation.includes(time(s.incidentAt)));
        for (const exhibit of file.evidence) {
          assert.ok(
            exhibit.length <= 300,
            `${kind}/${branch}/${seed}: ${exhibit.length}: ${exhibit}`,
          );
          assert.match(exhibit, /^[^:]+:/);
          assert.doesNotMatch(exhibit, /\b(?:you|your|undefined|NaN)\b/i);
        }
        assert.deepEqual(parseCase(file), file, `${kind}/${branch}/${seed}`);
        assert.equal(
          review.expectedVerdict,
          branch === 'supported' ? 'guilty' : null,
          `${kind}/${branch}/${seed}`,
        );
        assert.ok(review.prosecutionArgument.length > 30);
        assert.ok(review.defenseArgument.length > 30);
        records.add(file.accusation + [...file.evidence].sort().join('\n'));
      }
      assert.ok(records.size > 900, `${kind}/${branch}: ${records.size}`);
    }
  }
});

void test('the pool has two structures for each of the six requested crimes and three different records each', () => {
  assert.equal(caseKinds.length, 12);
  const categories = new Map<string, number>();
  for (const kind of caseKinds) {
    categories.set(
      catalog[kind].category,
      (categories.get(catalog[kind].category) ?? 0) + 1,
    );
    const cases = caseBranches.map((branch) =>
      renderScenario(createScenario(kind, 42, branch)),
    );
    assert.equal(new Set(cases.map((file) => file.title)).size, 1);
    assert.equal(
      new Set(cases.map((file) => JSON.stringify(file.evidence))).size,
      3,
    );
    for (const file of cases)
      assert.deepEqual(Object.keys(publicCase(file)).sort(), [
        'accusation',
        'category',
        'evidence',
        'title',
      ]);
  }
  assert.equal(categories.size, 6);
  assert.ok([...categories.values()].every((count) => count === 2));
});

void test('contested records retain both arguments without a predetermined acquittal', () => {
  for (const kind of [
    'workshop',
    'stairwell',
    'station',
    'pharmacy',
    'jeweler',
    'bus',
    'courier',
    'bank_call',
    'charity',
    'storage',
    'restaurant',
  ] as const) {
    const s = createScenario(kind, 42, 'unresolved');
    assert.equal(reviewScenario(s).hasContradiction, false, kind);
    assert.equal(reviewScenario(s).expectedVerdict, null, kind);
  }
  const fire = createScenario('restaurant', 42, 'unresolved');
  assert.match(reviewScenario(fire).truth, /deliberately ignited/);
  assert.equal(reviewScenario(fire).expectedVerdict, null);
});

void test('clock and travel uncertainty boundaries leave doubt at an unresolved event boundary', () => {
  const s = createScenario('workshop', 42, 'supported');
  assert.equal(s.kind, 'workshop');
  if (s.kind !== 'workshop') return;
  const exact = { ...s, departureDisplay: s.incidentAt, clockOffsetMinutes: 0 };
  assert.equal(reviewScenario(exact).expectedVerdict, null);
  assert.equal(
    reviewScenario({ ...exact, departureDisplay: s.incidentAt + 60_000 })
      .expectedVerdict,
    'guilty',
  );
  assert.equal(
    reviewScenario({
      ...exact,
      departureDisplay: s.incidentAt + 60_000,
      clockErrorMinutes: 1,
    }).expectedVerdict,
    null,
  );
  const p = createScenario('pharmacy', 42, 'supported');
  if (p.kind !== 'pharmacy') throw new Error('wrong case');
  const arrival = {
    ...p,
    departureAt: p.incidentAt - p.journeyMinutes * 60_000,
  };
  assert.equal(reviewScenario(arrival).expectedVerdict, null);
  assert.equal(
    reviewScenario({ ...arrival, departureAt: arrival.departureAt - 60_000 })
      .expectedVerdict,
    'guilty',
  );
  assert.equal(
    reviewScenario({
      ...arrival,
      departureAt: arrival.departureAt - 60_000,
      journeyUncertaintyMinutes: 1,
    }).expectedVerdict,
    null,
  );
});

void test('one changed fact updates its dependent exhibits and public conclusion', () => {
  const s = createScenario('workshop', 42, 'supported');
  if (s.kind !== 'workshop') throw new Error('wrong case');
  const corrected = { ...s, clockOffsetMinutes: 18 };
  assert.equal(reviewScenario(s).expectedVerdict, 'guilty');
  assert.equal(reviewScenario(corrected).expectedVerdict, null);
  const first = renderScenario(s).evidence;
  const second = renderScenario(corrected).evidence;
  assert.equal(
    first.filter((text) => !second.includes(text)).length,
    2,
    'calibration and recorded entry must both update',
  );
  const fire = createScenario('restaurant', 42, 'supported');
  if (fire.kind !== 'restaurant') throw new Error('wrong case');
  const electrical = { ...fire, origin: 'competing_origins' as const };
  assert.equal(reviewScenario(electrical).expectedVerdict, null);
  assert.equal(
    renderScenario(fire).evidence.filter(
      (text) => !renderScenario(electrical).evidence.includes(text),
    ).length,
    1,
  );
});

void test('timestamps retain calendar dates when an event crosses midnight or a year boundary', () => {
  assert.equal(time(Date.UTC(2026, 0, 1) - 60_000), '31 Dec 2025, 23:59');
  const s = createScenario('workshop', 42, 'supported');
  if (s.kind !== 'workshop') throw new Error('wrong case');
  const midnight = {
    ...s,
    incidentAt: Date.UTC(2026, 0, 2, 0, 1),
    entryAt: Date.UTC(2026, 0, 1, 23, 31),
    departureDisplay: Date.UTC(2026, 0, 2, 0, 5),
  };
  const text = renderScenario(midnight).evidence.join('\n');
  assert.match(text, /1 Jan 2026, 23:31/);
  assert.match(text, /2 Jan 2026, 00:05/);
});

void test('evidence timelines retain event and investigation dates across calendar boundaries', () => {
  for (const kind of [
    'pharmacy',
    'jeweler',
    'storage',
    'bank_call',
    'charity',
  ] as const) {
    for (const branch of caseBranches) {
      for (const incidentAt of [
        Date.UTC(2026, 0, 1, 0, 1),
        Date.UTC(2026, 11, 31, 23, 55),
      ]) {
        const original = createScenario(kind, 42, branch);
        const shift = incidentAt - original.incidentAt;
        const s = Object.fromEntries(
          Object.entries(original).map(([key, value]) => [
            key,
            key.endsWith('At') ? (value as number) + shift : value,
          ]),
        ) as typeof original;
        const file = renderScenario(s);
        const evidence = file.evidence.join('\n');
        assert.ok(file.accusation.includes(time(incidentAt)));
        if (s.kind === 'pharmacy') {
          assert.ok(incidentAt < s.searchAt && s.searchAt < s.examinedAt);
          assert.ok(evidence.includes(time(s.searchAt)));
          assert.ok(evidence.includes(time(s.examinedAt)));
        } else if (s.kind === 'jeweler') {
          assert.ok(s.visitAt < incidentAt && incidentAt < s.collectedAt);
          assert.ok(s.collectedAt < s.examinedAt);
          for (const at of [
            s.visitAt,
            s.collectedAt,
            s.examinedAt,
            s.offeredAt,
          ])
            assert.ok(evidence.includes(time(at)));
          const print = file.evidence.find((item) =>
            item.startsWith('Print record:'),
          )!;
          assert.doesNotMatch(print, /intact handle/);
        } else if (s.kind === 'storage') {
          assert.ok(incidentAt < s.collectedAt && s.collectedAt < s.receivedAt);
          assert.ok(s.receivedAt < s.examinedAt);
          for (const at of [s.collectedAt, s.receivedAt, s.examinedAt])
            assert.ok(evidence.includes(time(at)));
        } else if (s.kind === 'bank_call') {
          assert.ok(
            s.sessionStartedAt < incidentAt && incidentAt < s.sessionEndedAt,
          );
          assert.ok(
            s.sessionEndedAt < s.withdrawnAt && s.withdrawnAt < s.examinedAt,
          );
          for (const at of [s.withdrawnAt, s.examinedAt])
            assert.ok(evidence.includes(time(at)));
          if (s.access !== 'shared_laptop') {
            assert.ok(evidence.includes(time(s.sessionStartedAt)));
            assert.ok(evidence.includes(time(s.sessionEndedAt)));
          }
        } else if (s.kind === 'charity') {
          assert.ok(s.priorEventAt < incidentAt && incidentAt < s.searchedAt);
          assert.ok(evidence.includes(time(s.priorEventAt)));
          assert.ok(evidence.includes(time(s.searchedAt)));
        }
        assert.deepEqual(parseCase(file), file);
      }
    }
  }
});

void test('fraud timelines reject an examination before withdrawal and a search before collection', () => {
  const bank = createScenario('bank_call', 42, 'alternative');
  if (bank.kind !== 'bank_call') throw new Error('wrong case');
  for (const invalid of [
    { ...bank, sessionStartedAt: bank.incidentAt + 1 },
    { ...bank, sessionEndedAt: bank.incidentAt - 1 },
    { ...bank, examinedAt: bank.withdrawnAt - 1 },
  ])
    assert.throws(() => renderScenario(invalid), /Invalid/);
  const charity = createScenario('charity', 42, 'alternative');
  if (charity.kind !== 'charity') throw new Error('wrong case');
  for (const invalid of [
    { ...charity, priorEventAt: charity.incidentAt + 1 },
    { ...charity, searchedAt: charity.incidentAt - 1 },
  ])
    assert.throws(() => renderScenario(invalid), /Invalid/);
});

void test('forensic chronology rejects collection before the crime and examination before collection', () => {
  const s = createScenario('jeweler', 42, 'alternative');
  if (s.kind !== 'jeweler') throw new Error('wrong case');
  for (const invalid of [
    { ...s, collectedAt: s.incidentAt - 20 * 60_000 },
    { ...s, collectedAt: s.incidentAt },
    { ...s, examinedAt: s.collectedAt - 1 },
    { ...s, visitAt: s.incidentAt + 1 },
    { ...s, offeredAt: s.incidentAt - 1 },
    { ...s, examinedAt: 9_000_000_000_000_000 },
  ])
    assert.throws(() => renderScenario(invalid), /Invalid/);

  const p = createScenario('pharmacy', 42);
  if (p.kind !== 'pharmacy') throw new Error('wrong case');
  assert.throws(
    () => renderScenario({ ...p, searchAt: p.incidentAt - 1 }),
    /Invalid/,
  );
  assert.throws(
    () => renderScenario({ ...p, examinedAt: p.searchAt - 1 }),
    /Invalid/,
  );

  const f = createScenario('storage', 42);
  if (f.kind !== 'storage') throw new Error('wrong case');
  assert.throws(
    () => renderScenario({ ...f, collectedAt: f.incidentAt - 1 }),
    /Invalid/,
  );
  assert.throws(
    () => renderScenario({ ...f, receivedAt: f.collectedAt - 1 }),
    /Invalid/,
  );
  assert.throws(
    () => renderScenario({ ...f, examinedAt: f.receivedAt - 1 }),
    /Invalid/,
  );
});

void test('invalid chronology, units, and incompatible source facts are rejected', () => {
  const travel = createScenario('pharmacy', 42);
  if (travel.kind !== 'pharmacy') throw new Error('wrong case');
  for (const invalid of [
    { ...travel, journeyMinutes: 30 * 60_000 },
    { ...travel, departureAt: travel.incidentAt + 1 },
    { ...travel, journeyUncertaintyMinutes: -1 },
    { ...travel, incidentAt: NaN },
  ])
    assert.throws(() => renderScenario(invalid), /Invalid/);
  const scam = createScenario('bank_call', 42, 'alternative');
  if (scam.kind !== 'bank_call') throw new Error('wrong case');
  assert.throws(
    () =>
      validateScenario({
        ...scam,
        withdrawnAt: scam.incidentAt - 1,
      }),
    /Invalid/,
  );
  const sight = createScenario('stairwell', 42, 'alternative');
  if (sight.kind !== 'stairwell') throw new Error('wrong case');
  assert.throws(
    () => validateScenario({ ...sight, independentIdentification: true }),
    /Invalid/,
  );
});

void test('contested timing allows the accusation and the defense to remain possible', () => {
  for (let seed = 0; seed < 1000; seed++) {
    for (const branch of ['alternative', 'unresolved'] as const) {
      const clock = createScenario('workshop', seed, branch);
      if (clock.kind !== 'workshop') throw new Error('wrong case');
      const departure =
        clock.departureDisplay - clock.clockOffsetMinutes * 60_000;
      assert.ok(
        departure - clock.clockErrorMinutes * 60_000 < clock.incidentAt,
      );
      assert.ok(
        departure + clock.clockErrorMinutes * 60_000 > clock.incidentAt,
      );
      const travel = createScenario('pharmacy', seed, branch);
      if (travel.kind !== 'pharmacy') throw new Error('wrong case');
      const arrival = travel.departureAt + travel.journeyMinutes * 60_000;
      assert.ok(
        arrival - travel.journeyUncertaintyMinutes * 60_000 < travel.incidentAt,
      );
      assert.ok(
        arrival + travel.journeyUncertaintyMinutes * 60_000 > travel.incidentAt,
      );
    }
    const bus = createScenario('bus', seed, 'alternative');
    if (bus.kind !== 'bus') throw new Error('wrong case');
    assert.ok(bus.saleSignedAt < bus.incidentAt);
    assert.ok(
      bus.saleSignedAt + 7 * 24 * 60 * 60_000 > bus.incidentAt,
      'the signed sale does not eliminate access to the spare key',
    );
  }
});

void test('1,000 continuous rounds avoid the previous five structures and cover all twelve', () => {
  let recent: string[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < 1000; i++) {
    const file = generateCase(recent, Math.imul(i + 1, 2654435761) >>> 0);
    const title = file.title.split(' ·')[0];
    assert.ok(recent.slice(-5).every((old) => old.split(' ·')[0] !== title));
    seen.add(title);
    recent = [...recent, file.title].slice(-12);
  }
  assert.equal(seen.size, 12);
});

void test('seeds reproduce records, shuffle exhibits, and give supported and doubtful rounds comparable frequency', () => {
  for (const kind of caseKinds) {
    let supported = 0;
    const positions = new Set<number>();
    const first = renderScenario(
      createScenario(kind, 0, 'supported'),
    ).evidence[0].split(' ')[0];
    for (let seed = 0; seed < 1000; seed++) {
      const s = createScenario(kind, seed);
      if (reviewScenario(s).expectedVerdict === 'guilty') supported++;
      assert.deepEqual(
        renderScenario(s),
        renderScenario(createScenario(kind, seed)),
      );
      positions.add(
        renderScenario(
          createScenario(kind, seed, 'supported'),
        ).evidence.findIndex((text) => text.startsWith(`${first} `)),
      );
    }
    assert.ok(supported > 425 && supported < 575, `${kind}: ${supported}`);
    assert.equal(positions.size, 5);
  }
});

void test('all replacement branches send only public evidence and a period response to Jev', async () => {
  const env = { JEV_KEY: 'test-key' };
  for (const kind of caseKinds) {
    for (const branch of caseBranches) {
      const file = renderScenario(createScenario(kind, 42, branch));
      const token = await sealCase(file, env.JEV_KEY);
      const result = await judgeDefense(token, '.', env, async (_url, init) => {
        const body = JSON.parse(init!.body as string);
        assert.deepEqual(body.state, {
          accusation: file.accusation,
          evidence: file.evidence,
          playerDefense: '.',
        });
        assert.equal((init!.body as string).includes(file.solution), false);
        return Response.json({
          answers: {
            verdict: {
              type: 'choice',
              choice: 'not_guilty',
              probabilities: { guilty: 0.125, not_guilty: 0.875 },
            },
          },
        });
      });
      assert.deepEqual(result, {
        verdict: 'not_guilty',
        probabilities: { guilty: 0.125, not_guilty: 0.875 },
      });
    }
  }
});
