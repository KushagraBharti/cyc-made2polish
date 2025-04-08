import React, { useEffect, useState } from 'react';

interface ProfitData {
  cogsPerSKU: Record<string, number>;
  netProfit: number;
  grossMarginPercent: number;
}

const ProfitCOGS: React.FC = () => {
  const [data, setData] = useState<ProfitData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/profit")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p className="text-gray-500">Loading profit data...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profit & COGS</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">COGS per SKU</h3>
        <ul className="list-disc list-inside text-gray-700">
          {Object.entries(data.cogsPerSKU).map(([sku, cost]) => (
            <li key={sku}>{sku}: ${cost}</li>
          ))}
        </ul>
      </div>
      <div className="text-gray-700">
        <p>Net Profit: ${data.netProfit}</p>
        <p>Gross Margin: {data.grossMarginPercent}%</p>
      </div>
    </div>
  );
};

export default ProfitCOGS;
