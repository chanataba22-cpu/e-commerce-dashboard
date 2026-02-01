

import { useMemo, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  aggregateMonthlySales, 
  getTopProducts, 
  getCategorySales, 
  calculateMetrics 
} from './utils/dataProcessing';
import { ensembleForecast } from './utils/forecasting';
import { MetricsCards } from './components/MetricsCards';
import { TopProductsChart } from './components/TopProductsChart';
import { SalesTrendsChart } from './components/SalesTrendsChart';
import { ForecastChart } from './components/ForecastChart';
import { CategoryDistribution } from './components/CategoryDistribution';
import { Order } from './types';

export function App() {
  // 1. State for Data and Loading
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. CSV Data Fetching Logic
  useEffect(() => {
    // Fetching from the public folder
    fetch('/sales_data.csv')
      .then((res) => {
        if (!res.ok) throw new Error('CSV file not found. Check public folder.');
        return res.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            // Mapping CSV columns to our Type 'Order'
            const transformed = result.data.map((row: any) => ({
              orderId: row.OrderID || row.orderId,
              orderDate: row.Date || row.orderDate,
              productName: row.ProductName || row.productName,
              category: row.Category || row.category,
              salesAmount: row.Sales || row.salesAmount,
              quantity: row.Quantity || row.quantity
            }));
            setOrders(transformed);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message);
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 3. DATA PROCESSING LAYER
  const analyticsData = useMemo(() => {
    if (orders.length === 0) return null;

    try {
      const monthlySales = aggregateMonthlySales(orders);
      const topProducts = getTopProducts(orders, 5);
      const categorySales = getCategorySales(orders);
      const metrics = calculateMetrics(orders);
      const predictions = ensembleForecast(monthlySales, 3);
      
      return {
        monthlySales,
        topProducts,
        categorySales,
        metrics,
        predictions,
      };
    } catch (e) {
      console.error("Processing Error:", e);
      return null;
    }
  }, [orders]);

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading Sales Data from CSV...</p>
      </div>
    );
  }

  // Error Screen
  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 flex items-center justify-center p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
          <p>{error || "Data processing failed. Check CSV column names."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Smart E-Commerce Analytics
                </h1>
                <p className="text-gray-400 text-sm">Dynamic CSV Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-400">Source</p>
                <p className="font-semibold text-green-400">sales_data.csv</p>
              </div>
              <div className="px-4 py-2 bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-400">Total Records</p>
                <p className="font-semibold text-blue-400">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <MetricsCards
          totalRevenue={analyticsData.metrics.totalRevenue}
          totalOrders={analyticsData.metrics.totalOrders}
          averageOrderValue={analyticsData.metrics.averageOrderValue}
          growthRate={analyticsData.metrics.growthRate}
        />

        <div className="space-y-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopProductsChart data={analyticsData.topProducts} />
            <SalesTrendsChart data={analyticsData.monthlySales} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ForecastChart 
              historical={analyticsData.monthlySales} 
              predictions={analyticsData.predictions} 
            />
            <CategoryDistribution data={analyticsData.categorySales} />
          </div>
        </div>
      </main>
    </div>
  );
}