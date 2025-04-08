import React from 'react';
import SalesOverview from './components/SalesOverview';
import ProfitCOGS from './components/ProfitCOGS';
import InventoryTracker from './components/InventoryTracker';

const App: React.FC = () => {
  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Sales & Inventory Dashboard</h1>
      <section>
        <h2>Sales Overview</h2>
        <SalesOverview />
      </section>
      <section>
        <h2>Profit & COGS</h2>
        <ProfitCOGS />
      </section>
      <section>
        <h2>Inventory Tracker</h2>
        <InventoryTracker />
      </section>
    </div>
  );
};

export default App;
