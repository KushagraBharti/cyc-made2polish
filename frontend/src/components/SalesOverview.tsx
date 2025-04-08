import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

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
    return <p className="text-gray-500">Loading sales data...</p>;
  }

  const barChartData = {
    labels: data.salesByPeriod.map(item => item.period),
    datasets: [{
      label: 'Sales',
      data: data.salesByPeriod.map(item => item.sales),
      backgroundColor: 'rgba(75,192,192,0.6)'
    }]
  };

  const pieChartData = {
    labels: Object.keys(data.totalRevenue),
    datasets: [{
      label: 'Revenue',
      data: Object.values(data.totalRevenue),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Revenue by Channel (Pie Chart)</h3>
        <div className="w-72 h-72">
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Sales by Period (Bar Chart)</h3>
        <div className="w-96 h-72">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Units Sold by Product</h3>
        <ul className="list-disc list-inside text-gray-700">
          {Object.entries(data.unitsSold).map(([product, units]) => (
            <li key={product}>{product}: {units} units</li>
          ))}
        </ul>
        <p className="text-gray-700 mt-2">Average Order Value: ${data.averageOrderValue}</p>
      </div>
    </div>
  );
};

export default SalesOverview;
