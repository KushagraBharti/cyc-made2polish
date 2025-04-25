// src/components/SalesTab.tsx
import React, { useMemo } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { MetricsCard } from './MetricsCard';
import { useSalesData } from '../hooks/useSalesData';
import { SalesOrder } from '../types';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function SalesTab() {
  const { salesData, isLoading, isError } = useSalesData();

  // Calculate aggregated metrics once data is available
  const metrics = useMemo(() => {
    if (!salesData || salesData.length === 0) {
      return {
        totalRevenue: 0,
        totalUnits: 0,
        averageOrderValue: 0,
        netProfit: 0,
        grossMargin: 0,
      };
    }
    let totalRevenue = 0;
    let totalUnits = 0;
    let netProfit = 0;
    salesData.forEach((order: SalesOrder) => {
      totalRevenue += order.total;
      netProfit += order.netProfit;
      order.items.forEach(item => {
        totalUnits += item.quantity;
      });
    });
    const averageOrderValue = salesData.length ? totalRevenue / salesData.length : 0;
    const grossMargin = totalRevenue ? (netProfit / totalRevenue) * 100 : 0;
    return { totalRevenue, totalUnits, averageOrderValue, netProfit, grossMargin };
  }, [salesData]);

  // Build channel revenue for the pie chart
  const channelData = useMemo(() => {
    const channelMap: Record<string, number> = {};
    if (salesData) {
      salesData.forEach((order: SalesOrder) => {
        const channel = order.channel;
        channelMap[channel] = (channelMap[channel] || 0) + order.total;
      });
    }
    const labels = Object.keys(channelMap);
    const revenues = labels.map(label => channelMap[label]);
    return { labels, revenues };
  }, [salesData]);

  // Prepare daily (or weekly) sales data for the bar chart
  const dailySales = useMemo(() => {
    const revenueByDate: Record<string, number> = {};
    if (salesData) {
      salesData.forEach(order => {
        // Assume order.date is a valid date string
        const dateStr = new Date(order.date).toLocaleDateString();
        revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + order.total;
      });
    }
    const sortedDates = Object.keys(revenueByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const revenues = sortedDates.map(date => revenueByDate[date]);
    return { labels: sortedDates, revenues };
  }, [salesData]);

  // Prepare ChartJS datasets
  const pieData = {
    labels: channelData.labels,
    datasets: [
      {
        data: channelData.revenues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }
    ]
  };

  const barData = {
    labels: dailySales.labels,
    datasets: [
      {
        label: 'Daily Sales',
        data: dailySales.revenues,
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  };

  // Handle loading/error states
  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading Sales Data...</div>;
  if (isError) return <div className="container mx-auto px-4 py-8">Error loading sales data.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Sales Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricsCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricsCard
          title="Total Units Sold"
          value={metrics.totalUnits.toLocaleString()}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricsCard
          title="Average Order Value"
          value={`$${metrics.averageOrderValue.toFixed(2)}`}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue by Channel Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue by Channel</h2>
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Daily Sales Trend Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Sales Trend</h2>
          <div className="h-[300px]">
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
