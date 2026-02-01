interface MetricsCardsProps {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  growthRate: number;
}

export const MetricsCards = ({ 
  totalRevenue, 
  totalOrders, 
  averageOrderValue, 
  growthRate 
}: MetricsCardsProps) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: 'from-green-500 to-green-600',
      textColor: 'text-green-400',
    },
    {
      title: 'Avg Order Value',
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-400',
    },
    {
      title: 'Growth Rate',
      value: `${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(2)}%`,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgColor: growthRate >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      textColor: growthRate >= 0 ? 'text-emerald-400' : 'text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.bgColor}`}>
              <div className="text-white">{metric.icon}</div>
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h3>
          <p className={`text-3xl font-bold ${metric.textColor}`}>{metric.value}</p>
        </div>
      ))}
    </div>
  );
};
