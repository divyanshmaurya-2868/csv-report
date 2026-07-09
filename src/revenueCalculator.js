/**
 * Groups orders by category and sums revenue (quantity * unitPrice) per category.
 * Pure function: same input always produces same output, no side effects.
 *
 * @param {Array<{category: string, quantity: number, unitPrice: number}>} orders
 * @returns {Object<string, number>} e.g. { Electronics: 111500, Furniture: 42000 }
 */
function calculateRevenueByCategory(orders) {
  return orders.reduce((acc, order) => {
    const revenue = order.quantity * order.unitPrice;
    acc[order.category] = (acc[order.category] || 0) + revenue;
    return acc;
  }, {});
}

/**
 * Sums revenue across all categories to get the grand total.
 *
 * @param {Object<string, number>} categoryRevenue
 * @returns {number} total revenue
 */
function calculateTotalRevenue(categoryRevenue) {
  return Object.values(categoryRevenue).reduce((sum, value) => sum + value, 0);
}

module.exports = { calculateRevenueByCategory, calculateTotalRevenue };
