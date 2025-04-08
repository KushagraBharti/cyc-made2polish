// frontend/src/components/InventoryTracker.tsx
import React, { useEffect, useState } from 'react';

interface InventoryData {
  unitsAvailable: Record<string, number>;
  productionBatches: { batch: string; product: string; quantity: number }[];
  lowStockAlert: Record<string, boolean>;
}

const InventoryTracker: React.FC = () => {
  const [data, setData] = useState<InventoryData | null>(null);

  const fetchInventory = () => {
    fetch("http://localhost:5000/api/inventory")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddInventory = async () => {
    const product = prompt("Enter product name:");
    const quantityStr = prompt("Enter quantity to add:");
    const quantity = parseInt(quantityStr || "0", 10);
    if (product && !isNaN(quantity)) {
      await fetch("http://localhost:5000/api/inventory/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ product, quantity })
      });
      fetchInventory();
    }
  };

  const handleSubtractInventory = async () => {
    const product = prompt("Enter product name:");
    const quantityStr = prompt("Enter quantity to subtract:");
    const quantity = parseInt(quantityStr || "0", 10);
    if (product && !isNaN(quantity)) {
      await fetch("http://localhost:5000/api/inventory/subtract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ product, quantity })
      });
      fetchInventory();
    }
  };

  if (!data) {
    return <p>Loading inventory data...</p>;
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Inventory Tracker</h2>
      <button onClick={handleAddInventory} style={{ marginRight: '10px', padding: '8px 12px' }}>
        Add Inventory
      </button>
      <button onClick={handleSubtractInventory} style={{ padding: '8px 12px' }}>
        Subtract Inventory
      </button>
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
