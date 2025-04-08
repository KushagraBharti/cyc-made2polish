// frontend/src/components/DashboardTable.tsx
import React, { useEffect, useState } from 'react';

interface SalesData {
  totalRevenue: Record<string, number>;
  unitsSold: Record<string, number>;
  averageOrderValue: number;
}

interface ProfitData {
  netProfit: number;
  grossMarginPercent: number;
}

const DashboardTable: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [profitData, setProfitData] = useState<ProfitData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/sales")
      .then(response => response.json())
      .then(data => {
        // Pick only the needed data for the dashboard
        const { totalRevenue, unitsSold, averageOrderValue } = data;
        setSalesData({ totalRevenue, unitsSold, averageOrderValue });
      })
      .catch(console.error);

    fetch("http://localhost:5000/api/profit")
      .then(response => response.json())
      .then(setProfitData)
      .catch(console.error);
  }, []);

  if (!salesData || !profitData) {
    return <p>Loading dashboard metrics...</p>;
  }

  // Summarize key metrics
  const totalRevenue = Object.values(salesData.totalRevenue).reduce((a, b) => a + b, 0);
  const totalUnitsSold = Object.values(salesData.unitsSold).reduce((a, b) => a + b, 0);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Key Metrics</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Metric</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Total Revenue</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>${totalRevenue}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Total Units Sold</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{totalUnitsSold}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Average Order Value</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>${salesData.averageOrderValue}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Net Profit</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>${profitData.netProfit}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>Gross Margin %</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{profitData.grossMarginPercent}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
