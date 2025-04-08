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
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p>Loading profit data...</p>;
  }

  return (
    <div>
      <h3>Cost of Goods Sold per SKU</h3>
      <ul>
        {Object.entries(data.cogsPerSKU).map(([sku, cost]) => (
          <li key={sku}>{sku}: ${cost}</li>
        ))}
      </ul>
      <p>Net Profit: ${data.netProfit}</p>
      <p>Gross Margin: {data.grossMarginPercent}%</p>
    </div>
  );
};

export default ProfitCOGS;
