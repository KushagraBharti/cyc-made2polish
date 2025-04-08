import React, { useEffect, useState } from 'react';

interface InventoryData {
  unitsAvailable: Record<string, number>;
  productionBatches: { batch: string; product: string; quantity: number }[];
  lowStockAlert: Record<string, boolean>;
}

const InventoryTracker: React.FC = () => {
  const [data, setData] = useState<InventoryData | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/inventory")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p>Loading inventory data...</p>;
  }

  return (
    <div>
      <h3>Units Available per Product</h3>
      <ul>
        {Object.entries(data.unitsAvailable).map(([product, units]) => (
          <li key={product}>
            {product}: {units} units 
            {data.lowStockAlert[product] && <strong style={{ color: "red" }}> - Low Stock!</strong>}
          </li>
        ))}
      </ul>

      <h3>Production Batches</h3>
      <ul>
        {data.productionBatches.map((batch) => (
          <li key={batch.batch}>
            {batch.batch} - {batch.product}: {batch.quantity} units produced
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryTracker;
