// frontend/src/components/SalesOverview.tsx
import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

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

  // Prepare data for the Bar chart (Sales by Period)
  const barChartData = {
    labels: data.salesByPeriod.map(item => item.period),
    datasets: [{
      label: 'Sales',
      data: data.salesByPeriod.map(item => item.sales),
      backgroundColor: 'rgba(75,192,192,0.6)'
    }]
  };

  // Prepare data for the Pie chart (Revenue by Channel)
  const pieChartData = {
    labels: Object.keys(data.totalRevenue),
    datasets: [{
      label: 'Revenue',
      data: Object.values(data.totalRevenue),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }]
  };

  // Chart options that disable the default aspect ratio
  const chartOptions = {
    maintainAspectRatio: false
  };

  return (
    <div>
      <h2>Sales Overview</h2>

      {/* Pie Chart Container */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Revenue by Channel (Pie Chart)</h3>
        <div style={{ width: '300px', height: '300px' }}>
          <Pie data={pieChartData} options={chartOptions} />
        </div>
      </div>

      {/* Bar Chart Container */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Sales by Period (Bar Chart)</h3>
        <div style={{ width: '400px', height: '300px' }}>
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

      {/* Additional Data */}
      <div>
        <h3>Units Sold by Product</h3>
        <ul>
          {Object.entries(data.unitsSold).map(([product, units]) => (
            <li key={product}>{product}: {units} units</li>
          ))}
        </ul>
        <p>Average Order Value: ${data.averageOrderValue}</p>
      </div>
    </div>
  );
};

export default SalesOverview;
