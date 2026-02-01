// Data Types for E-Commerce Analytics
export interface Order {
  orderId: string;
  productName: string;
  category: string;
  salesAmount: number;
  orderDate: string;
}

export interface MonthlySales {
  month: string;
  sales: number;
  timestamp: number;
}

export interface ProductSales {
  productName: string;
  totalSales: number;
  orderCount: number;
}

export interface CategorySales {
  category: string;
  totalSales: number;
  percentage: number;
}

export interface SalesPrediction {
  month: string;
  actualSales?: number;
  predictedSales: number;
}

export interface AnalyticsData {
  topProducts: ProductSales[];
  salesTrends: MonthlySales[];
  categorySales: CategorySales[];
  predictions: SalesPrediction[];
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}
