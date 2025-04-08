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
    return <p className="text-gray-500">Loading dashboard metrics...</p>;
  }

  const totalRevenue = Object.values(salesData.totalRevenue).reduce((a, b) => a + b, 0);
  const totalUnitsSold = Object.values(salesData.unitsSold).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border border-gray-200">Metric</th>
            <th className="py-2 px-4 border border-gray-200">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="py-2 px-4 border border-gray-200">Total Revenue</td>
            <td className="py-2 px-4 border border-gray-200">${totalRevenue}</td>
          </tr>
          <tr className="text-center">
            <td className="py-2 px-4 border border-gray-200">Total Units Sold</td>
            <td className="py-2 px-4 border border-gray-200">{totalUnitsSold}</td>
          </tr>
          <tr className="text-center">
            <td className="py-2 px-4 border border-gray-200">Average Order Value</td>
            <td className="py-2 px-4 border border-gray-200">${salesData.averageOrderValue}</td>
          </tr>
          <tr className="text-center">
            <td className="py-2 px-4 border border-gray-200">Net Profit</td>
            <td className="py-2 px-4 border border-gray-200">${profitData.netProfit}</td>
          </tr>
          <tr className="text-center">
            <td className="py-2 px-4 border border-gray-200">Gross Margin %</td>
            <td className="py-2 px-4 border border-gray-200">
              {profitData.grossMarginPercent}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
