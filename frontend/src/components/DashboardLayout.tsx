// src/components/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function DashboardLayout() {
  // You can maintain state for the active tab here
  const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'log'>('sales');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="py-6">
        <Outlet />
      </main>
    </div>
  );
}
