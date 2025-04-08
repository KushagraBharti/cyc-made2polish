import React from 'react';
import SalesOverview from './components/SalesOverview';
import ProfitCOGS from './components/ProfitCOGS';
import InventoryTracker from './components/InventoryTracker';
import DashboardTable from './components/DashboardTable';

const App: React.FC = () => {
  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Sales & Inventory Dashboard</h1>
      </header>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Left Column – Key Metrics and Sales Graphs */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <DashboardTable />
          <SalesOverview />
        </div>
        {/* Right Column – Profit and Inventory */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <ProfitCOGS />
          <InventoryTracker />
        </div>
      </div>
    </div>
  );
};

export default App;
