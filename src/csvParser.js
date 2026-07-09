const REQUIRED_COLUMNS = ["order_id", "product", "category", "quantity", "unit_price"];

/**
 * Minimal CSV line splitter. Handles simple comma-separated values.
 * NOTE: does not handle quoted fields containing commas (e.g. "Smith, John") —
 * that's a known limitation, documented in README, acceptable for this dataset
 * where no field contains a comma. A production system would use a proper
 * CSV parsing library (e.g. csv-parse) instead of a hand-rolled splitter.
 */
function splitCsvLine(line) {
  return line.split(",").map((cell) => cell.trim());
}
                                                                                            
/**
 * Parses raw CSV text (no external library) into an array of row objects
 * keyed by the header column names.
 */
function parseCsvToRecords(csvContent) {
  const lines = csvContent
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCsvLine(lines[i]);
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] !== undefined ? values[index] : "";
    });
    records.push(record);
  }

  return records;
}


/**
 * Parses raw CSV content into an array of order objects.
 *
 * Design decisions :
 * - If any required column is missing from the header, the WHOLE file is rejected.
 * - If any row has a non-numeric quantity or unit_price, the WHOLE file is rejected.
 *   (Financial data: a silently-skipped bad row could produce a misleadingly "clean"
 *   report that under-reports revenue without anyone noticing. Failing loudly is safer.)
 * - Zero quantity is treated as VALID (e.g. a free sample line item) and contributes 0 revenue.
 * - Negative quantity is treated as INVALID data, not a "return". Returns should be
 *   modeled as a separate, explicit transaction type in a real system, not a negative number
 *   on an orders file.
 * - Decimal unit_price (e.g. 99.99) is supported via parseFloat.
 *
 * @param {string} csvContent - raw CSV file content
 * @returns {Array<{orderId: string, product: string, category: string, quantity: number, unitPrice: number}>}
 * @throws {Error} if the file is malformed, missing columns, or has invalid numeric data
 */
function parseOrders(csvContent) {
  if (csvContent === undefined || csvContent === null || csvContent.trim() === "") {
    return [];
  }

  const records = parseCsvToRecords(csvContent);

  if (records.length === 0) {
    return [];
  }

  const headerColumns = Object.keys(records[0]);
  const missingColumns = REQUIRED_COLUMNS.filter((col) => !headerColumns.includes(col));
  if (missingColumns.length > 0) {
    throw new Error(
      `CSV is missing required column(s): ${missingColumns.join(", ")}`
    );
  }

  return records.map((row, index) => {
    const rowNumber = index + 2; // +1 for header row, +1 for 1-based indexing

    const quantity = Number(row.quantity);
    if (row.quantity === "" || row.quantity === undefined || Number.isNaN(quantity)) {
      throw new Error(
        `Invalid quantity "${row.quantity}" on row ${rowNumber} (order ${row.order_id})`
      );
    }
    if (quantity < 0) {
      throw new Error(
        `Negative quantity (${quantity}) on row ${rowNumber} (order ${row.order_id}) is not valid order data`
      );
    }

    const unitPrice = Number(row.unit_price);
    if (row.unit_price === "" || row.unit_price === undefined || Number.isNaN(unitPrice)) {
      throw new Error(
        `Invalid unit_price "${row.unit_price}" on row ${rowNumber} (order ${row.order_id})`
      );
    }
    if (unitPrice < 0) {
      throw new Error(
        `Negative unit_price (${unitPrice}) on row ${rowNumber} (order ${row.order_id}) is not valid order data`
      );
    }

    return {
      orderId: row.order_id,
      product: row.product,
      category: row.category,
      quantity,
      unitPrice,
    };
  });
}

module.exports = { parseOrders, REQUIRED_COLUMNS };
