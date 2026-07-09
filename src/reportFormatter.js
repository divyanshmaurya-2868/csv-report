/**
 * Formats a number as Indian Rupees with thousands separators, e.g. 111500 -> "₹111,500"
 * Note: uses en-IN locale grouping (lakh/crore style: 1,11,500 for larger numbers is
 * the "correct" Indian format, but the task's expected output uses plain thousands
 * grouping "₹111,500", so we match that expected format explicitly rather than
 * relying on toLocaleString's Indian digit grouping.
 */
// Reviewed
// this fn is used to format the revenue values in the report and helps to avoid floating point noise by rounding to 2 decimal places and adding commas for thousands separators
// . It also adds the ₹ symbol at the start of the formatted string.

function formatCurrency(amount) {
  const rounded = Math.round(amount * 100) / 100; // avoid floating point noise
  const [whole, decimal] = rounded.toString().split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `₹${withCommas}.${decimal}` : `₹${withCommas}`;
}

/**
 * Builds the full terminal report string.
 *
 * NOTE: The task's suggested contract is formatReport(categoryRevenue) only.
 * We extended it to formatReport(categoryRevenue, totalRevenue) because the
 * expected output includes a "Total Revenue" line, and computing the total
 * inside the formatter would duplicate logic that already lives in
 * revenueCalculator.js. This keeps formatting and calculation responsibilities
 * separate (deviation documented as required by the task).
 *
 * @param {Object<string, number>} categoryRevenue
 * @param {number} totalRevenue
 * @returns {string}
 */

// Reviewed
// this fn is used to build the full terminal report string
// it takes the category revenues and total revenue as input and returns a formatted string
function formatReport(categoryRevenue, totalRevenue) {
  const lines = ["Revenue Report"];

  const categories = Object.keys(categoryRevenue).sort();

  if (categories.length === 0) {
    lines.push("(no orders found)");
  } else {
    for (const category of categories) {
      lines.push(`${category}: ${formatCurrency(categoryRevenue[category])}`);
    }
  }

  lines.push("");
  lines.push(`Total Revenue: ${formatCurrency(totalRevenue)}`);

  return lines.join("\n");
}

module.exports = { formatReport, formatCurrency };
