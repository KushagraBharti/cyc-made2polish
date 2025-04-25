import React, { useState } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import type { InventoryItem } from '../types';

const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    name: 'Classic Polish',
    quantity: 150,
    batchNumber: 'B2024-001',
    lastUpdated: '2024-03-15',
    lowStockThreshold: 100
  },
  {
    id: '2',
    name: 'Premium Wax',
    quantity: 75,
    batchNumber: 'B2024-002',
    lastUpdated: '2024-03-14',
    lowStockThreshold: 80
  },
  {
    id: '3',
    name: 'Microfiber Cloth',
    quantity: 300,
    batchNumber: 'B2024-003',
    lastUpdated: '2024-03-13',
    lowStockThreshold: 200
  }
];

export function InventoryTab() {
  const [inventory, setInventory] = useState(mockInventoryData);

  const handleAddStock = (itemId: string) => {
    const quantity = parseInt(prompt('Enter quantity to add:') || '0', 10);
    if (quantity > 0) {
      setInventory(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    }
  };

  const handleSubtractStock = (itemId: string) => {
    const quantity = parseInt(prompt('Enter quantity to subtract:') || '0', 10);
    if (quantity > 0) {
      setInventory(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
            : item
        )
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-600">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Package className="mr-2" />
            Current Inventory
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {inventory.map(item => (
            <div key={item.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {item.name}
                    {item.quantity <= item.lowStockThreshold && (
                      <AlertTriangle className="ml-2 text-amber-500" size={20} />
                    )}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Batch: {item.batchNumber} | Last Updated: {item.lastUpdated}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900">
                      {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">units</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddStock(item.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => handleSubtractStock(item.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Subtract
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}