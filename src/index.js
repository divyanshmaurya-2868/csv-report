// Reviewed
// this is node js import
const fs = require("fs/promises");
const path = require("path");
// import local fn

const { parseOrders } = require("./csvParser");
const { calculateRevenueByCategory, calculateTotalRevenue } = require("./revenueCalculator");
const { formatReport } = require("./reportFormatter");

/**
 * index.js is intentionally "thin": it only handles CLI concerns
 * (reading argv, reading the file, wiring the pieces together, and
 * printing errors cleanly). All business logic lives in the other modules
 * so it can be unit tested without touching the filesystem or process.argv.
 */
// asyn because awaat is required to read the file and parse it
async function main() {
  const filePath = process.argv[2];//convert terminal written info into file path as an array 

  if (!filePath) {
    console.error("Usage: node src/index.js <csv-file>");
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);

  let csvContent;
  try {
    csvContent = await fs.readFile(absolutePath, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: File not found: ${absolutePath}`);
    } else {
      console.error(`Error: Could not read file: ${error.message}`);
    }
    process.exit(1);
  }

  let orders;
  try {
    orders = parseOrders(csvContent);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }

  const categoryRevenue = calculateRevenueByCategory(orders);
  const totalRevenue = calculateTotalRevenue(categoryRevenue);
  const report = formatReport(categoryRevenue, totalRevenue);

  console.log(report);
}

main().catch((error) => {
  console.error("Application failed:", error.message);
  process.exit(1);
});
