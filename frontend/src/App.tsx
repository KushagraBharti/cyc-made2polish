import React, { useState } from 'react';
import SalesTab from './components/SalesTab';
import InventoryTab from './components/InventoryTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Sales & Inventory Dashboard</h1>
        </div>
      </header>
      <nav className="container mx-auto mt-4">
        <div className="flex justify-center space-x-4">
          <button
            className={`py-2 px-4 rounded transition-colors ${
              activeTab === 'sales'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border border-blue-600'
            }`}
            onClick={() => setActiveTab('sales')}
          >
            Sales
          </button>
          <button
            className={`py-2 px-4 rounded transition-colors ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border border-blue-600'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-6">
        {activeTab === 'sales' ? <SalesTab /> : <InventoryTab />}
      </main>
      <footer className="bg-gray-200 py-4 mt-6">
        <div className="container mx-auto text-center text-gray-600">
          © {new Date().getFullYear()} Made2Polish Dashboard
        </div>
      </footer>
    </div>
  );
};

export default App;
