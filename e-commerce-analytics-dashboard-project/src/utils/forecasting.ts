/**
 * SALES FORECASTING ALGORITHMS
 * Linear Regression and Moving Average for predictive analytics
 */

import { MonthlySales, SalesPrediction } from '../types';

/**
 * Simple Linear Regression
 * y = mx + b
 */
export const linearRegression = (dataPoints: { x: number; y: number }[]) => {
  const n = dataPoints.length;
  
  if (n === 0) return { slope: 0, intercept: 0 };

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  dataPoints.forEach((point) => {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

/**
 * Predict using Linear Regression
 */
export const predictWithLinearRegression = (
  monthlySales: MonthlySales[],
  monthsToPredict: number = 3
): SalesPrediction[] => {
  if (monthlySales.length === 0) return [];

  // Prepare data points (x = month index, y = sales)
  const dataPoints = monthlySales.map((item, index) => ({
    x: index,
    y: item.sales,
  }));

  const { slope, intercept } = linearRegression(dataPoints);

  const predictions: SalesPrediction[] = [];

  // Generate predictions for next N months
  for (let i = 1; i <= monthsToPredict; i++) {
    const nextIndex = monthlySales.length - 1 + i;
    const predictedSales = slope * nextIndex + intercept;

    // Calculate next month
    const lastDate = new Date(monthlySales[monthlySales.length - 1].month + '-01');
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + i);

    const monthKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    predictions.push({
      month: monthKey,
      predictedSales: Math.max(0, Math.round(predictedSales * 100) / 100),
    });
  }

  return predictions;
};

/**
 * Moving Average (Simple)
 */
export const calculateMovingAverage = (
  monthlySales: MonthlySales[],
  windowSize: number = 3
): number => {
  if (monthlySales.length < windowSize) {
    // If not enough data, return average of all available data
    const sum = monthlySales.reduce((acc, item) => acc + item.sales, 0);
    return sum / monthlySales.length;
  }

  // Take last N months
  const recentSales = monthlySales.slice(-windowSize);
  const sum = recentSales.reduce((acc, item) => acc + item.sales, 0);
  
  return sum / windowSize;
};

/**
 * Predict using Moving Average
 */
export const predictWithMovingAverage = (
  monthlySales: MonthlySales[],
  monthsToPredict: number = 3,
  windowSize: number = 3
): SalesPrediction[] => {
  if (monthlySales.length === 0) return [];

  const predictions: SalesPrediction[] = [];
  let workingData = [...monthlySales];

  for (let i = 1; i <= monthsToPredict; i++) {
    const predictedSales = calculateMovingAverage(workingData, windowSize);

    // Calculate next month
    const lastDate = new Date(monthlySales[monthlySales.length - 1].month + '-01');
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + i);

    const monthKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    predictions.push({
      month: monthKey,
      predictedSales: Math.round(predictedSales * 100) / 100,
    });

    // Add prediction to working data for next iteration
    workingData.push({
      month: monthKey,
      sales: predictedSales,
      timestamp: nextDate.getTime(),
    });
  }

  return predictions;
};

/**
 * Weighted Moving Average (gives more weight to recent data)
 */
export const predictWithWeightedMovingAverage = (
  monthlySales: MonthlySales[],
  monthsToPredict: number = 3,
  windowSize: number = 3
): SalesPrediction[] => {
  if (monthlySales.length === 0) return [];

  const predictions: SalesPrediction[] = [];

  for (let i = 1; i <= monthsToPredict; i++) {
    const recentSales = monthlySales.slice(-windowSize);
    
    // Calculate weights (more recent = higher weight)
    let weightedSum = 0;
    let totalWeight = 0;

    recentSales.forEach((item, index) => {
      const weight = index + 1; // 1, 2, 3, etc.
      weightedSum += item.sales * weight;
      totalWeight += weight;
    });

    const predictedSales = weightedSum / totalWeight;

    // Calculate next month
    const lastDate = new Date(monthlySales[monthlySales.length - 1].month + '-01');
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + i);

    const monthKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`;

    predictions.push({
      month: monthKey,
      predictedSales: Math.round(predictedSales * 100) / 100,
    });

    // Add prediction to working data for next iteration
    monthlySales.push({
      month: monthKey,
      sales: predictedSales,
      timestamp: nextDate.getTime(),
    });
  }

  return predictions;
};

/**
 * Ensemble prediction (combines multiple methods)
 */
export const ensembleForecast = (
  monthlySales: MonthlySales[],
  monthsToPredict: number = 3
): SalesPrediction[] => {
  const lrPredictions = predictWithLinearRegression(monthlySales, monthsToPredict);
  const maPredictions = predictWithMovingAverage(monthlySales, monthsToPredict);
  const wmaPredictions = predictWithWeightedMovingAverage([...monthlySales], monthsToPredict);

  // Combine predictions (average of all methods)
  return lrPredictions.map((lrPred, index) => ({
    month: lrPred.month,
    predictedSales: Math.round(
      ((lrPred.predictedSales + 
        maPredictions[index].predictedSales + 
        wmaPredictions[index].predictedSales) / 3) * 100
    ) / 100,
  }));
};
