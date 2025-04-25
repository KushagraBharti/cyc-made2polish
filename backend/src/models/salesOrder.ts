export interface OrderItem {
    sku: string;
    name: string;
    quantity: number;
    price: number;
    cogs: number; // Cost of Goods Sold
  }
  
  export interface Customer {
    name?: string;
    region?: string;
  }
  
  export interface SalesOrder {
    id: string;
    date: string;
    platform: 'etsy' | 'tiktok' | 'popup';
    items: OrderItem[];
    customer: Customer;
    total: number;
    netProfit: number; // auto-calculated (total revenue - total COGS)
    channel: string;
  }
  