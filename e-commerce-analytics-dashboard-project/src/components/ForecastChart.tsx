import { 
  ComposedChart, 
  Line, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { MonthlySales, SalesPrediction } from '../types';

interface ForecastChartProps {
  historical: MonthlySales[];
  predictions: SalesPrediction[];
}

export const ForecastChart = ({ historical, predictions }: ForecastChartProps) => {
  // Combine last 6 months of historical data with predictions
  const recentHistorical = historical.slice(-6);
  
  const chartData = [
    ...recentHistorical.map((item) => ({
      month: item.month,
      actual: item.sales,
      predicted: null,
    })),
    ...predictions.map((item) => ({
      month: item.month,
      actual: item.actualSales || null,
      predicted: item.predictedSales,
    })),
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Actual vs Predicted Sales (Next 3 Months)
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            label={{ value: 'Sales ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF' }} />
          <Bar 
            dataKey="actual" 
            fill="#3B82F6" 
            radius={[8, 8, 0, 0]}
            name="Actual Sales"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="#A855F7" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#A855F7', r: 5 }}
            activeDot={{ r: 7 }}
            name="Predicted Sales"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-400">
          <span className="font-semibold text-purple-400">Forecasting Algorithm:</span> Ensemble Method 
          (Linear Regression + Moving Average + Weighted Moving Average)
        </p>
      </div>
    </div>
  );
};
