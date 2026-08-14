/* =====================================================================
   Glass Ball schema-lockstep suite.
   Both repos (glass-ball / glass-ball-mobile) read and write the SAME
   synced db. This suite extracts the storage seam (SCHEMA, STORE_KEY,
   mergeDefaults, normalize) from each repo's src/index.html and proves:
     1. the schema string and storage keys match across the pair,
     2. normalize() upgrades legacy-shaped data identically on both sides,
     3. the sync-code prefix is Glass Ball's own (GLASS1-, never CHIARO).
   Paths are parameterized: GB_DESKTOP / GB_MOBILE env vars override the
   default sibling-checkout layout (../glass-ball-mobile).
   A guard must be seen to fail: add a field to one repo's mergeDefaults
   only, and test 'normalize agrees across the pair' must go red.
   ===================================================================== */
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const DESKTOP = process.env.GB_DESKTOP || path.join(__dirname, '..');
const MOBILE  = process.env.GB_MOBILE  || path.join(__dirname, '..', '..', 'glass-ball-mobile');

function read(repo){ return fs.readFileSync(path.join(repo, 'src', 'index.html'), 'utf8'); }

// brace-matched extraction of a top-level `function name(...){ ... }`
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
function constStr(src, name){
  const m = src.match(new RegExp("const\\s+" + name + "\\s*=\\s*'([^']+)'"));
  assert.ok(m, 'const ' + name + ' not found');
  return m[1];
}
function seamOf(repo){
  const src = read(repo);
  const SCHEMA = constStr(src, 'SCHEMA');
  const STORE_KEY = constStr(src, 'STORE_KEY');
  const KV_KEY = constStr(src, 'KV_KEY');
  const code = `const SCHEMA='${SCHEMA}';\n` + extractFn(src, 'mergeDefaults') + '\n' + extractFn(src, 'normalize') + '\nnormalize';
  const normalize = vm.runInNewContext(code, {});
  return { src, SCHEMA, STORE_KEY, KV_KEY, normalize };
}

const d = seamOf(DESKTOP);
const m = seamOf(MOBILE);

test('schema string matches across the pair', () => {
  assert.strictEqual(d.SCHEMA, m.SCHEMA);
});
test('storage + kv keys match across the pair', () => {
  assert.strictEqual(d.STORE_KEY, m.STORE_KEY);
  assert.strictEqual(d.KV_KEY, m.KV_KEY);
});
test('identity is Glass Ball\'s own — no CTT keys or prefixes', () => {
  for (const s of [d, m]) {
    assert.ok(s.STORE_KEY.startsWith('glassball'), 'STORE_KEY is ' + s.STORE_KEY);
    assert.ok(!/ctt_v1|ctt_kv|CHIARO1-/.test(s.src), 'CTT identity leaked into src');
    assert.ok(s.src.includes("'GLASS1-'"), 'GLASS1- sync-code prefix missing');
  }
});

// Legacy-shaped inputs — the most load-bearing migration check. Each must
// come out with the full default shape, the schema stamped, and real data kept.
const LEGACY = [
  {},                                             // empty first boot
  { schema: 'glassball-0' },                      // unknown older schema string
  { days: { '2026-01-05': { glass: [{ id: 'a', name: 'enrollment', done: false }] } } },  // partial day, no rubber/note
  { projects: [{ id: 'p1', name: 'proj' }] },     // project missing steps/notes
];
test('normalize() upgrades legacy-shaped data (both repos)', () => {
  for (const s of [d, m]) {
    for (const legacy of LEGACY) {
      const out = s.normalize(JSON.parse(JSON.stringify(legacy)));
      assert.strictEqual(out.schema, s.SCHEMA);
      assert.ok(out.days && typeof out.days === 'object');
      assert.ok(Array.isArray(out.projects) && Array.isArray(out.recurring));
      assert.ok(out.quotes && Array.isArray(out.quotes.start) && Array.isArray(out.quotes.finish));
      assert.ok(out.sync && 'journalId' in out.sync);
      for (const day of Object.values(out.days)) {
        assert.ok(Array.isArray(day.glass) && Array.isArray(day.rubber) && Array.isArray(day.skipRecur));
        assert.strictEqual(typeof day.note, 'string');
      }
      for (const p of out.projects) { assert.ok(Array.isArray(p.steps)); assert.strictEqual(typeof p.notes, 'string'); }
    }
    // data survives
    const kept = s.normalize({ days: { '2026-01-05': { glass: [{ id: 'a', name: 'enrollment', done: true }] } } });
    assert.strictEqual(kept.days['2026-01-05'].glass[0].name, 'enrollment');
  }
});

test('normalize agrees across the pair (same input → same shape)', () => {
  for (const legacy of LEGACY) {
    // JSON-roundtrip: each normalize ran in its own vm realm, and
    // deepStrictEqual would trip on cross-realm prototypes, not real drift.
    const a = JSON.parse(JSON.stringify(d.normalize(JSON.parse(JSON.stringify(legacy)))));
    const b = JSON.parse(JSON.stringify(m.normalize(JSON.parse(JSON.stringify(legacy)))));
    assert.deepStrictEqual(a, b, 'normalize() diverged between desktop and mobile');
  }
});
