// src/types.ts

// src/types.ts

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  cogs: number;
}

export interface Customer {
  name?: string;
  region?: string;
}

export interface SalesOrder {
  id: string;
  date: string; // e.g., ISO string
  platform: 'etsy' | 'tiktok' | 'popup';
  items: OrderItem[];
  customer: Customer;
  total: number;
  netProfit: number; // total revenue minus total COGS
  channel: string;
  orderStatus?: string; // optional field: e.g., 'Completed', 'Pending'
}

// (Other types, e.g., InventoryItem, remain as-is)
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  batchNumber: string;
  lastUpdated: string;
  lowStockThreshold: number;
}
