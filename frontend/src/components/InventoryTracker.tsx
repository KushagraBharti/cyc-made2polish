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
    return <p className="text-gray-500">Loading inventory data...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inventory Tracker</h2>
      <div className="mb-4">
        <button
          onClick={handleAddInventory}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mr-2 transition-colors"
        >
          Add Inventory
        </button>
        <button
          onClick={handleSubtractInventory}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
        >
          Subtract Inventory
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Units Available per Product</h3>
        <ul className="list-disc list-inside text-gray-700">
          {Object.entries(data.unitsAvailable).map(([product, units]) => (
            <li key={product}>
              {product}: {units} units
              {data.lowStockAlert[product] && (
                <span className="text-red-500 font-bold"> - Low Stock!</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Production Batches</h3>
        <ul className="list-disc list-inside text-gray-700">
          {data.productionBatches.map((batch) => (
            <li key={batch.batch}>
              {batch.batch} - {batch.product}: {batch.quantity} units produced
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryTracker;
