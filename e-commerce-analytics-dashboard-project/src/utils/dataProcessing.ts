/**
 * DATA PROCESSING LAYER
 * Exploratory Data Analysis (EDA) and Data Transformation
 */

import { Order, MonthlySales, ProductSales, CategorySales } from '../types';

/**
 * Aggregate sales by month
 */
export const aggregateMonthlySales = (orders: Order[]): MonthlySales[] => {
  const monthlyMap = new Map<string, number>();

  orders.forEach((order) => {
    const date = new Date(order.orderDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + order.salesAmount);
  });

  const monthlySales: MonthlySales[] = Array.from(monthlyMap.entries())
    .map(([month, sales]) => ({
      month,
      sales: Math.round(sales * 100) / 100,
      timestamp: new Date(month + '-01').getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  return monthlySales;
};

/**
 * Get top N selling products
 */
export const getTopProducts = (orders: Order[], topN: number = 5): ProductSales[] => {
  const productMap = new Map<string, { totalSales: number; orderCount: number }>();

  orders.forEach((order) => {
    const existing = productMap.get(order.productName) || { totalSales: 0, orderCount: 0 };
    productMap.set(order.productName, {
      totalSales: existing.totalSales + order.salesAmount,
      orderCount: existing.orderCount + 1,
    });
  });

  return Array.from(productMap.entries())
    .map(([productName, data]) => ({
      productName,
      totalSales: Math.round(data.totalSales * 100) / 100,
      orderCount: data.orderCount,
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, topN);
};

/**
 * Get category-wise sales distribution
 */
export const getCategorySales = (orders: Order[]): CategorySales[] => {
  const categoryMap = new Map<string, number>();
  let totalSales = 0;

  orders.forEach((order) => {
    categoryMap.set(order.category, (categoryMap.get(order.category) || 0) + order.salesAmount);
    totalSales += order.salesAmount;
  });

  return Array.from(categoryMap.entries())
    .map(([category, sales]) => ({
      category,
      totalSales: Math.round(sales * 100) / 100,
      percentage: Math.round((sales / totalSales) * 10000) / 100,
    }))
    .sort((a, b) => b.totalSales - a.totalSales);
};

/**
 * Calculate key metrics
 */
export const calculateMetrics = (orders: Order[]) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.salesAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalRevenue / totalOrders;

  // Calculate growth rate (last 3 months vs previous 3 months)
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const recentSales = orders
    .filter((o) => new Date(o.orderDate) >= threeMonthsAgo)
    .reduce((sum, o) => sum + o.salesAmount, 0);

  const previousSales = orders
    .filter(
      (o) =>
        new Date(o.orderDate) >= sixMonthsAgo && new Date(o.orderDate) < threeMonthsAgo
    )
    .reduce((sum, o) => sum + o.salesAmount, 0);

  const growthRate = previousSales > 0 ? ((recentSales - previousSales) / previousSales) * 100 : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    growthRate: Math.round(growthRate * 100) / 100,
  };
};

/**
 * Filter orders by date range
 */
export const filterOrdersByDateRange = (
  orders: Order[],
  startDate: Date,
  endDate: Date
): Order[] => {
  return orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= startDate && orderDate <= endDate;
  });
};

/**
 * Get recent orders (for analysis)
 */
export const getRecentOrders = (orders: Order[], months: number = 12): Order[] => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);

  return orders.filter((order) => new Date(order.orderDate) >= cutoffDate);
};
