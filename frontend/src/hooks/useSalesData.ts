// src/hooks/useSalesData.ts
import useSWR from 'swr';
import axios from 'axios';
import { SalesOrder } from '../types';

// Define a generic fetcher function
const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useSalesData() {
  const { data, error } = useSWR<SalesOrder[]>('http://localhost:3000/api/sales', fetcher, {
    refreshInterval: 60000, // refresh every 60 seconds
  });
  return {
    salesData: data,
    isLoading: !error && !data,
    isError: error,
  };
}
