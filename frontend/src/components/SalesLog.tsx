// src/components/SalesLog.tsx
import React from 'react';
import { useSalesData } from '../hooks/useSalesData';
import { SalesOrder } from '../types';

export function SalesLog() {
  const { salesData, isLoading, isError } = useSalesData();

  if (isLoading) {
    return <div>Loading Sales Log...</div>;
  }
  if (isError) {
    return <div>Error loading Sales Log.</div>;
  }
  if (!salesData) {
    // Fallback for the case where data didn't load or is empty
    return <div>No data found.</div>;
  }  

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading Sales Log...</div>;
  if (isError) return <div className="container mx-auto px-4 py-8">Error loading Sales Log.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Sales Log</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Sale ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Products Sold</th>
              <th className="py-2 px-4 border-b">Amount ($)</th>
              <th className="py-2 px-4 border-b">Net Profit ($)</th>
              <th className="py-2 px-4 border-b">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale: SalesOrder) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{sale.id}</td>
                <td className="py-2 px-4 border-b">{new Date(sale.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{sale.customer.name || '-'}</td>
                <td className="py-2 px-4 border-b">
                  {sale.items.map((item) => (
                    <div key={item.sku}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b">{sale.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td className="py-2 px-4 border-b">{sale.netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                <td className="py-2 px-4 border-b">
                  {sale.orderStatus ? sale.orderStatus : 'Completed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
