import React, { useEffect, useState } from 'react';

interface SalesData {
  totalRevenue: Record<string, number>;
  unitsSold: Record<string, number>;
  averageOrderValue: number;
  salesByPeriod: { period: string; sales: number }[];
}

const SalesOverview: React.FC = () => {
  const [data, setData] = useState<SalesData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/sales")
      .then(response => response.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p>Loading sales data...</p>;
  }

  return (
    <div>
      <h3>Total Revenue by Channel</h3>
      <ul>
        {Object.entries(data.totalRevenue).map(([channel, revenue]) => (
          <li key={channel}>{channel}: ${revenue}</li>
        ))}
      </ul>

      <h3>Units Sold by Product</h3>
      <ul>
        {Object.entries(data.unitsSold).map(([product, units]) => (
          <li key={product}>{product}: {units} units</li>
        ))}
      </ul>

      <p>Average Order Value: ${data.averageOrderValue}</p>

      <h3>Sales by Week/Month</h3>
      <ul>
        {data.salesByPeriod.map((item) => (
          <li key={item.period}>{item.period}: ${item.sales}</li>
        ))}
      </ul>
    </div>
  );
};

export default SalesOverview;
