# Project Context for AI-Assisted Development

## What this project is
CLI tool: reads an ecommerce orders CSV, groups revenue by category, prints
a report. See README.md for full usage.

## Architecture rules to follow
- `src/index.js` stays thin: CLI argv handling + wiring only. No business logic.
- `src/csvParser.js`: parsing + validation only. Throws on invalid data
  (whole-file rejection policy — see README "Assumptions").
- `src/revenueCalculator.js`: pure functions only, no I/O, easy to unit test.
- `src/reportFormatter.js`: string formatting only, no calculation logic.

## Design decisions already made (do not silently change)
- Zero quantity = valid, contributes ₹0.
- Negative quantity = invalid, reject whole file.
- Bad row (non-numeric qty/price) = reject whole file, not skip-row.
- No external CSV library (network-restricted dev environment) — parser is
  hand-rolled and doesn't support quoted commas in fields.

## Testing
Uses Node's built-in `node:test` + `node:assert/strict` (not vitest/jest —
chosen because it requires no npm install). Run with `npm test`.
