// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { SalesTab } from './components/SalesTab';
import { InventoryTab } from './components/InventoryTab';
import { SalesLog } from './components/SalesLog';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route path="/login" element={<Login />} />
        {/* Protected routes wrapped by the ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          {/* Nested layout that includes header and shared UI */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/inventory" element={<InventoryTab />} />
            <Route path="/sales-log" element={<SalesLog />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
