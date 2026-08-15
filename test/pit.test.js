/* =====================================================================
   Ball-pit merge suite.
   The journal syncs last-write-wins; the PIT cannot, because two people
   write it. Its merge is item-level and must be CONVERGENT: whatever
   order the two sides exchange in, they must land on identical state,
   and no edit may ever be silently dropped. That property is the entire
   reason the pit is allowed to exist, so it gets its own suite.

   pitMerge is extracted from BOTH repos' src/index.html and every
   property is asserted against both copies — a pit that merged
   differently on phone and desktop would corrupt the one thing the two
   surfaces share.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const DESKTOP = process.env.GB_DESKTOP || path.join(__dirname, '..');
const MOBILE  = process.env.GB_MOBILE  || path.join(__dirname, '..', '..', 'glass-ball-mobile');

function extractFn(src, name){
  const start = src.indexOf('function ' + name + '(');
  assert.notStrictEqual(start, -1, 'function ' + name + ' not found');
  let i = src.indexOf('{', start), depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (!depth) return src.slice(start, i + 1); }
  }
  throw new Error('unbalanced braces extracting ' + name);
}
function mergeOf(repo){
  const src = fs.readFileSync(path.join(repo, 'src', 'index.html'), 'utf8');
  const days = (src.match(/const\s+PIT_TOMB_DAYS\s*=\s*(\d+)/) || [])[1];
  assert.ok(days, 'PIT_TOMB_DAYS not found in ' + repo);
  const code = `const PIT_TOMB_DAYS=${days};\n` + extractFn(src, 'pitMerge') + '\npitMerge';
  const raw = vm.runInNewContext(code, {});
  // The VM has its own realm, so its arrays fail deepStrictEqual's prototype
  // check even when the contents match. Round-trip back into this realm.
  return { merge: (a, b) => JSON.parse(JSON.stringify(raw(a, b))), tombDays: Number(days) };
}

const D = mergeOf(DESKTOP);
const M = mergeOf(MOBILE);
const BOTH = [['desktop', D], ['mobile', M]];

const clone = o => JSON.parse(JSON.stringify(o));
const item = (id, over) => Object.assign(
  { id, name: id, by: 'a', note: '', createdAt: 1000, lastEdit: 1000,
    done: false, doneBy: '', doneAt: null, deleted: false }, over || {});

test('tomb-retention window matches across the pair', () => {
  assert.strictEqual(D.tombDays, M.tombDays);
});

test('union: neither side loses an item the other has', () => {
  for (const [who, S] of BOTH) {
    const mine = [item('a'), item('b')];
    const theirs = [item('b'), item('c')];
    const ids = S.merge(mine, theirs).map(x => x.id);
    assert.deepStrictEqual(ids, ['a', 'b', 'c'], who);
  }
});

test('newer lastEdit wins, from either side', () => {
  for (const [who, S] of BOTH) {
    const old = item('a', { name: 'old', lastEdit: 100 });
    const fresh = item('a', { name: 'new', lastEdit: 200 });
    assert.strictEqual(S.merge([old], [fresh])[0].name, 'new', who + ' remote newer');
    assert.strictEqual(S.merge([fresh], [old])[0].name, 'new', who + ' local newer');
  }
});

test('a catch is never undone by a stale copy', () => {
  // the exact scenario blob-level LWW would lose: she caught it, his device
  // still holds the pre-catch version and syncs after her.
  for (const [who, S] of BOTH) {
    const caught = item('a', { done: true, doneBy: 'Joelle', doneAt: 500, lastEdit: 500 });
    const stale  = item('a', { done: false, lastEdit: 200 });
    assert.strictEqual(S.merge([stale], [caught])[0].done, true, who);
    assert.strictEqual(S.merge([caught], [stale])[0].done, true, who + ' reversed');
  }
});

test('CONVERGENCE: order of exchange cannot change the result', () => {
  for (const [who, S] of BOTH) {
    const A = [item('a', { lastEdit: 300, name: 'A-side' }), item('b', { lastEdit: 100 }), item('d')];
    const B = [item('a', { lastEdit: 100, name: 'B-side' }), item('b', { lastEdit: 300, done: true }), item('c')];
    const ab = S.merge(clone(A), clone(B));
    const ba = S.merge(clone(B), clone(A));
    assert.deepStrictEqual(ab, ba, who + ': merge must be commutative');
    // and idempotent — re-merging your own result changes nothing
    assert.deepStrictEqual(S.merge(clone(ab), clone(ab)), ab, who + ': merge must be idempotent');
    // and associative enough that a third round trip is a no-op
    assert.deepStrictEqual(S.merge(clone(ab), clone(B)), ab, who + ': re-merging an older peer is a no-op');
  }
});

test('identical stamps still converge (deterministic tie-break)', () => {
  for (const [who, S] of BOTH) {
    const x = item('a', { name: 'xxx', lastEdit: 777 });
    const y = item('a', { name: 'yyy', lastEdit: 777 });
    const ab = S.merge([clone(x)], [clone(y)]);
    const ba = S.merge([clone(y)], [clone(x)]);
    assert.deepStrictEqual(ab, ba, who + ': a tie must not depend on who merged');
  }
});

test('tombstones propagate a deletion, and expire eventually', () => {
  const now = Date.now();
  for (const [who, S] of BOTH) {
    const alive = item('a', { lastEdit: now - 1000 });
    const killed = item('a', { deleted: true, lastEdit: now });
    assert.strictEqual(S.merge([alive], [killed])[0].deleted, true, who + ': deletion wins when newer');
    // a re-add after the delete still wins — deletion is not permanent
    const readded = item('a', { deleted: false, lastEdit: now + 10 });
    assert.strictEqual(S.merge([killed], [readded])[0].deleted, false, who + ': later re-add wins');
    // ancient tombstones are swept so the shelf doesn't grow forever
    const ancient = item('z', { deleted: true, lastEdit: now - (S.tombDays + 5) * 86400000 });
    assert.strictEqual(S.merge([ancient], []).length, 0, who + ': ancient tombstone retired');
    const recent = item('z', { deleted: true, lastEdit: now - 86400000 });
    assert.strictEqual(S.merge([recent], []).length, 1, who + ': recent tombstone kept');
  }
});

test('junk never enters the shelf', () => {
  for (const [who, S] of BOTH) {
    const out = S.merge([null, undefined, {}, { name: 'no id' }, item('a')], [0, '', item('b')]);
    assert.deepStrictEqual(out.map(x => x.id), ['a', 'b'], who);
  }
});

test('empty and missing inputs are safe', () => {
  for (const [who, S] of BOTH) {
    assert.deepStrictEqual(S.merge(undefined, undefined), [], who);
    assert.deepStrictEqual(S.merge(null, [item('a')]).map(x => x.id), ['a'], who);
    assert.deepStrictEqual(S.merge([item('a')], null).map(x => x.id), ['a'], who);
  }
});

test('ordering is stable and identical across the pair', () => {
  const A = [item('c', { createdAt: 30 }), item('a', { createdAt: 10 }), item('b', { createdAt: 20 })];
  const B = [item('d', { createdAt: 15 })];
  const d = D.merge(clone(A), clone(B)).map(x => x.id);
  const m = M.merge(clone(A), clone(B)).map(x => x.id);
  assert.deepStrictEqual(d, ['a', 'd', 'b', 'c']);
  assert.deepStrictEqual(d, m, 'the two repos must order the shelf identically');
});

test('the two repos agree on a large randomised exchange', () => {
  // deterministic pseudo-random — no Math.random, so a failure reproduces
  let seed = 12345;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const mk = n => Array.from({ length: n }, (_, i) => item('id' + Math.floor(rnd() * 40), {
    createdAt: Math.floor(rnd() * 1000),
    lastEdit: Math.floor(rnd() * 1000),
    done: rnd() > 0.6,
    deleted: rnd() > 0.85,
    name: 'n' + Math.floor(rnd() * 100),
  }));
  const A = mk(60), B = mk(60);
  const d = D.merge(clone(A), clone(B));
  const m = M.merge(clone(A), clone(B));
  assert.deepStrictEqual(JSON.parse(JSON.stringify(d)), JSON.parse(JSON.stringify(m)));
  // and it still converges at scale
  assert.deepStrictEqual(D.merge(clone(B), clone(A)), d);
});
