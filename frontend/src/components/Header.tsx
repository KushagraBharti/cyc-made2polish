// src/components/Header.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'sales' | 'inventory' | 'log';
  onTabChange: (tab: 'sales' | 'inventory' | 'log') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles size={32} />
          <h1 className="text-2xl font-bold">Made2Polish Dashboard</h1>
        </div>
        <nav className="flex space-x-2">
          <button
            onClick={() => onTabChange('sales')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'sales' ? 'bg-white text-blue-800' : 'text-white hover:bg-blue-700'}`}
          >
            Sales
          </button>
          <button
            onClick={() => onTabChange('inventory')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'inventory' ? 'bg-white text-blue-800' : 'text-white hover:bg-blue-700'}`}
          >
            Inventory
          </button>
          <button
            onClick={() => onTabChange('log')}
            className={`px-4 py-2 rounded transition-colors ${activeTab === 'log' ? 'bg-white text-blue-800' : 'text-white hover:bg-blue-700'}`}
          >
            Sales Log
          </button>
        </nav>
      </div>
    </header>
  );
}
