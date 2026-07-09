const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  calculateRevenueByCategory,
  calculateTotalRevenue,
} = require("../src/revenueCalculator");

describe("calculateRevenueByCategory", () => {
  it("TEST 1 - Normal Data: calculates revenue for a single category correctly", () => {
    // Arrange
    const orders = [
      { category: "Electronics", quantity: 2, unitPrice: 50000 },
      { category: "Electronics", quantity: 5, unitPrice: 800 },
    ];
    // Act
    const result = calculateRevenueByCategory(orders);
    // Assert
    assert.equal(result.Electronics, 104000);
  });

  it("TEST 2 - Multiple Categories: groups revenue into separate categories", () => {
    const orders = [
      { category: "Electronics", quantity: 2, unitPrice: 50000 },
      { category: "Furniture", quantity: 2, unitPrice: 12000 },
      { category: "Furniture", quantity: 1, unitPrice: 18000 },
      { category: "Stationery", quantity: 10, unitPrice: 100 },
    ];
    const result = calculateRevenueByCategory(orders);
    assert.deepEqual(result, {
      Electronics: 100000,
      Furniture: 42000,
      Stationery: 1000,
    });
  });

  it("TEST 8 - Zero Quantity: contributes zero revenue but category still appears", () => {
    const orders = [{ category: "Electronics", quantity: 0, unitPrice: 50000 }];
    const result = calculateRevenueByCategory(orders);
    assert.equal(result.Electronics, 0);
  });

  it("TEST 10 - Decimal Price: handles floating point unit prices", () => {
    const orders = [{ category: "Stationery", quantity: 3, unitPrice: 99.99 }];
    const result = calculateRevenueByCategory(orders);
    assert.ok(Math.abs(result.Stationery - 299.97) < 0.01);
  });

  it("returns an empty object for an empty orders array", () => {
    assert.deepEqual(calculateRevenueByCategory([]), {});
  });
});

describe("calculateTotalRevenue", () => {
  it("sums revenue across all categories", () => {
    const categoryRevenue = { Electronics: 111500, Furniture: 42000, Stationery: 1000 };
    assert.equal(calculateTotalRevenue(categoryRevenue), 154500);
  });

  it("returns 0 for an empty category map", () => {
    assert.equal(calculateTotalRevenue({}), 0);
  });
});
