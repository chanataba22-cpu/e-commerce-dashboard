import { Order } from '../types';

// Generate realistic e-commerce dataset (Amazon/Daraz style)
export const generateMockOrders = (): Order[] => {
  const products = [
    { name: 'Samsung Galaxy S23 Ultra', category: 'Electronics', price: 1299 },
    { name: 'iPhone 15 Pro Max', category: 'Electronics', price: 1499 },
    { name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', price: 399 },
    { name: 'MacBook Pro M3', category: 'Electronics', price: 2499 },
    { name: 'iPad Air 5th Gen', category: 'Electronics', price: 699 },
    { name: 'Nike Air Max 270', category: 'Fashion', price: 150 },
    { name: 'Adidas Ultraboost 22', category: 'Fashion', price: 180 },
    { name: 'Levi\'s 501 Original Jeans', category: 'Fashion', price: 89 },
    { name: 'The North Face Jacket', category: 'Fashion', price: 299 },
    { name: 'Ray-Ban Aviator Sunglasses', category: 'Fashion', price: 154 },
    { name: 'Instant Pot Duo 7-in-1', category: 'Home & Kitchen', price: 89 },
    { name: 'Dyson V15 Vacuum', category: 'Home & Kitchen', price: 699 },
    { name: 'KitchenAid Stand Mixer', category: 'Home & Kitchen', price: 379 },
    { name: 'Ninja Air Fryer', category: 'Home & Kitchen', price: 119 },
    { name: 'Keurig K-Elite Coffee Maker', category: 'Home & Kitchen', price: 189 },
    { name: 'Fitbit Charge 6', category: 'Health & Fitness', price: 159 },
    { name: 'Yoga Mat Premium', category: 'Health & Fitness', price: 49 },
    { name: 'Protein Powder 5lb', category: 'Health & Fitness', price: 59 },
    { name: 'Resistance Bands Set', category: 'Health & Fitness', price: 29 },
    { name: 'Dumbbell Set 20kg', category: 'Health & Fitness', price: 129 },
    { name: 'The Psychology of Money', category: 'Books', price: 16 },
    { name: 'Atomic Habits', category: 'Books', price: 18 },
    { name: 'Think and Grow Rich', category: 'Books', price: 14 },
    { name: 'Sapiens', category: 'Books', price: 22 },
    { name: '1984 by George Orwell', category: 'Books', price: 12 },
  ];

  const orders: Order[] = [];
  const startDate = new Date('2023-01-01');
  const endDate = new Date('2024-12-31');

  // Generate orders over 2 years with seasonal patterns
  for (let i = 0; i < 2000; i++) {
    const randomDate = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    );

    // Seasonal multiplier (higher sales in Nov-Dec)
    const month = randomDate.getMonth();
    const seasonalMultiplier = month >= 10 ? 1.8 : month >= 6 ? 1.2 : 1.0;

    // Select random product with weighted probability
    const productIndex = Math.floor(Math.random() * Math.random() * products.length);
    const product = products[productIndex];

    // Add some variation to price
    const priceVariation = 0.9 + Math.random() * 0.2;
    const finalPrice = Math.round(product.price * priceVariation * seasonalMultiplier * 100) / 100;

    orders.push({
      orderId: `ORD-${String(i + 1).padStart(6, '0')}`,
      productName: product.name,
      category: product.category,
      salesAmount: finalPrice,
      orderDate: randomDate.toISOString().split('T')[0],
    });
  }

  // Sort by date
  return orders.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
};

export const mockOrders = generateMockOrders();
