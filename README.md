# csv-report

A Node.js command-line tool that reads ecommerce order data from a CSV file
and generates a revenue summary grouped by product category.

## Project Overview

Given a CSV of orders (order id, product, category, quantity, unit price),
the tool calculates `revenue = quantity × unit_price` for every row, groups
the revenue by category, and prints a formatted report with a grand total.

## Prerequisites

- Node.js v18 or later (uses the built-in `node:test` runner and
  `fs/promises`, no external packages required)

## Installation

```bash
git clone <repo-url>
cd csv-report
npm install
```

There are currently no runtime dependencies — CSV parsing is implemented
directly in `src/csvParser.js` (see **Known Limitations** below for why).

## How to Run

```bash
node src/index.js <path-to-csv-file>
```

## CSV Format

The file must have a header row with exactly these columns:

```
order_id,product,category,quantity,unit_price
```

Example:

```csv
order_id,product,category,quantity,unit_price
ORD-001,Laptop,Electronics,2,50000
ORD-002,Mouse,Electronics,5,800
```

## Example Command

```bash
node src/index.js ./data/orders.csv
```

## Example Output

```
Revenue Report
Electronics: ₹111,500
Furniture: ₹42,000
Stationery: ₹1,000

Total Revenue: ₹154,500
```

## How to Run Tests

```bash
npm test
```

This runs Node's built-in test runner (`node --test`) against everything in
`tests/`. 16 tests currently pass, covering the normal path plus every edge
case listed in the task's Mandatory Test Cases (empty file, missing file,
missing column, invalid quantity/price, zero/negative quantity, decimal
price).

## Assumptions

- **Zero quantity is valid** — treated as a legitimate line item (e.g. a
  free sample) that contributes ₹0 revenue. It does not error out.
- **Negative quantity is invalid data**, not a "return". A real system
  should model returns as an explicit, separate transaction type rather
  than a negative number on an orders file. The CLI rejects the whole file
  if it finds one.
- **A malformed row (non-numeric quantity/price) rejects the entire file**,
  rather than silently skipping the bad row. For financial reports, a
  silently-dropped row could produce a report that looks clean but is
  quietly wrong — failing loudly was judged safer than failing silently.
- **Decimal prices are supported** (e.g. `99.99`) using standard JS floating
  point arithmetic.

## Known Limitations

- **CSV parsing is hand-rolled** (simple `split(",")` per line) instead of
  using a library like `csv-parse`. This was a pragmatic choice made in
  this environment because `npm install` had no network access to the
  public registry. The hand-rolled parser does **not** handle quoted
  fields containing commas (e.g. a product name like `"Chair, Office"`).
  For a real production CSV importer, a proper parsing library should be
  used instead.
- **Floating-point money is not production-safe.** This exercise uses
  plain JavaScript numbers for currency, which can introduce tiny rounding
  errors (e.g. `0.1 + 0.2 !== 0.3`). A production financial system should
  store money as integers in the smallest currency unit (e.g. paise
  instead of rupees) or use a dedicated decimal/money library, and only
  convert to a human-readable rupee string at the very end for display.
- The currency formatter matches the task's expected plain thousands
  grouping (`₹111,500`), not the Indian lakh/crore digit grouping
  (`₹1,11,500`) that `Number.prototype.toLocaleString('en-IN')` would
  produce, since the task's expected output uses the former.
