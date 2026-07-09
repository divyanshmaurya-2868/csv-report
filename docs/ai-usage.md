# AI Interaction Summary

## What prompts were given to AI?

1. **Planning prompt** (Step 1 of task's required workflow): asked Claude to
   propose project structure, file responsibilities, edge cases, and a
   testing strategy — explicitly without writing implementation code yet.
2. **Scaffolding prompt** (Step 2): asked Claude to implement the approved
   plan, with the constraints: keep parsing/calculation/formatting in
   separate files, add meaningful error handling (no empty catch blocks),
   add unit tests, and explain every generated file.

## What code was generated?

All files under `src/`, `tests/`, `data/`, plus `README.md`, `CLAUDE.md`,
and this file were AI-generated as an initial scaffold.

## What code was manually changed / reviewed?

- **Dependency choice**: the original plan assumed the `csv-parse` npm
  package. When `npm install` failed (403 Forbidden — no network access to
  the npm registry in this sandbox), the CSV parser was rewritten to a
  dependency-free hand-rolled line splitter. This is a real limitation
  (doesn't handle quoted commas) and is called out in README's "Known
  Limitations" rather than hidden.
- **Test framework**: same reason — `vitest` couldn't be installed, so
  tests were rewritten to use Node's built-in `node:test` + `assert/strict`
  instead. Test *cases* (what's being tested) stayed the same; only the
  assertion library syntax changed.
- **`formatReport` signature**: the task's suggested contract was
  `formatReport(categoryRevenue)`, but the expected output requires a
  "Total Revenue" line. Rather than recomputing the total inside the
  formatter (duplicating logic already in `revenueCalculator.js`), the
  signature was deliberately changed to `formatReport(categoryRevenue,
  totalRevenue)`. This is a documented deviation from the suggested
  contract, justified by keeping calculation and formatting responsibilities
  separate.

## What mistakes or weaknesses were found in the AI-generated output?

- The first draft assumed network access would be available for
  `npm install` and didn't have a fallback plan — had to catch this at
  install time and adjust the approach for both the CSV parser and the
  test runner.
- The initial currency formatter used `toLocaleString('en-IN')`, which
  produces Indian-style digit grouping (`₹1,11,500`). This did NOT match
  the task's expected output (`₹111,500`, plain thousands grouping), so a
  custom regex-based formatter was written instead and verified against
  the exact expected string in the task description.

## How was the AI-generated implementation verified?

- Ran `npm test` (16 tests) — all passing, covering every one of the
  task's 10 mandatory test scenarios (normal data, multiple categories,
  empty file, missing file, missing column, invalid quantity, invalid
  price, zero quantity, negative quantity, decimal price).
- Manually ran the CLI against `data/orders.csv` and confirmed the output
  matches the task's expected output character-for-character.
- Manually ran the CLI against a missing file path and confirmed a clean
  error message (no raw Node.js stack trace).
- Manually ran the CLI against `empty.csv`, `missing-column.csv`, and
  `invalid-quantity.csv` and confirmed each fails the way the documented
  design decisions say it should.
