import React from 'react';
import DashboardTable from './DashboardTable';
import SalesOverview from './SalesOverview';
import ProfitCOGS from './ProfitCOGS';

const SalesTab: React.FC = () => {
  return (
    <div className="space-y-6 p-4">
      <DashboardTable />
      <SalesOverview />
      <ProfitCOGS />
    </div>
  );
};

export default SalesTab;
