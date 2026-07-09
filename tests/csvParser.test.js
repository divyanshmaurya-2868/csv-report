const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { parseOrders } = require("../src/csvParser");

describe("parseOrders", () => {
  it("TEST 1 - Normal Data: parses a well-formed CSV into order objects", () => {
    const csv =
      "order_id,product,category,quantity,unit_price\n" +
      "ORD-001,Laptop,Electronics,2,50000\n";
    const result = parseOrders(csv);
    assert.deepEqual(result, [
      {
        orderId: "ORD-001",
        product: "Laptop",
        category: "Electronics",
        quantity: 2,
        unitPrice: 50000,
      },
    ]);
  });

  it("TEST 3 - Empty File: returns an empty array for a header-only file", () => {
    const csv = "order_id,product,category,quantity,unit_price\n";
    assert.deepEqual(parseOrders(csv), []);
  });

  it("TEST 3b - Empty File: returns an empty array for a completely empty string", () => {
    assert.deepEqual(parseOrders(""), []);
  });

  it("TEST 5 - Missing Required Column: throws a clear error", () => {
    const csv = "order_id,product,quantity,unit_price\nORD-001,Laptop,2,50000\n";
    assert.throws(() => parseOrders(csv), /missing required column/i);
  });

  it("TEST 6 - Invalid Quantity: throws when quantity is non-numeric", () => {
    const csv =
      "order_id,product,category,quantity,unit_price\n" +
      "ORD-001,Laptop,Electronics,abc,50000\n";
    assert.throws(() => parseOrders(csv), /invalid quantity/i);
  });

  it("TEST 7 - Invalid Price: throws when unit_price is non-numeric", () => {
    const csv =
      "order_id,product,category,quantity,unit_price\n" +
      "ORD-001,Laptop,Electronics,2,hello\n";
    assert.throws(() => parseOrders(csv), /invalid unit_price/i);
  });

  it("TEST 8 - Zero Quantity: is accepted as valid", () => {
    const csv =
      "order_id,product,category,quantity,unit_price\n" +
      "ORD-001,Laptop,Electronics,0,50000\n";
    const result = parseOrders(csv);
    assert.equal(result[0].quantity, 0);
  });

  it("TEST 9 - Negative Quantity: is rejected as invalid data", () => {
    const csv =
      "order_id,product,category,quantity,unit_price\n" +
      "ORD-001,Laptop,Electronics,-2,50000\n";
    assert.throws(() => parseOrders(csv), /negative quantity/i);
  });

  it("TEST 10 - Decimal Price: is parsed correctly", () => {
    const csv =
      "order_id,product,category,quantity,unit_price\n" +
      "ORD-001,Notebook,Stationery,3,99.99\n";
    const result = parseOrders(csv);
    assert.ok(Math.abs(result[0].unitPrice - 99.99) < 0.001);
  });
});
