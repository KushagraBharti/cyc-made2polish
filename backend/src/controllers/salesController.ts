import { SalesOrder } from '../models/salesOrder';
import { fetchEtsyReceipts } from '../api/etsy';
import { fetchTikTokOrders } from '../api/tiktok';
import { fetchPopupSales } from '../api/popup';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Helper function to load backup data

async function loadBackupData() {
  try {
    // Use __dirname directly in CommonJS
    const backupPath = path.join(__dirname, '../data/backupSalesData.json');
    const backupDataRaw = await fs.readFile(backupPath, 'utf-8');
    return JSON.parse(backupDataRaw);
  } catch (error) {
    console.error('Failed to load backup data:', error);
    return [];
  }
}

// Dummy normalization functions: replace with actual logic as needed.
function normalizeEtsyData(data: any): SalesOrder[] {
  // TODO: Convert raw Etsy data to SalesOrder objects.
  return [];
}

function normalizeTikTokData(data: any): SalesOrder[] {
  // TODO: Convert raw TikTok data to SalesOrder objects.
  return [];
}

function normalizePopupData(data: any): SalesOrder[] {
  // TODO: Convert raw CSV pop-up data to SalesOrder objects.
  return [];
}

export async function fetchAllSalesData(): Promise<SalesOrder[]> {
  try {
    // Force fallback if environment variable is set
    if (process.env.USE_BACKUP_DATA === 'true') {
      console.warn('USE_BACKUP_DATA flag active. Using backup data.');
      return loadBackupData();
    }
    
    // Fetch live data
    const [etsyRaw, tiktokRaw] = await Promise.all([
      fetchEtsyReceipts(),
      fetchTikTokOrders()
    ]);
    
    // For pop-up sales, assume a CSV file path (update as needed)
    const popupRaw = await fetchPopupSales('path/to/popupsales.csv');

    const etsyData = normalizeEtsyData(etsyRaw);
    const tiktokData = normalizeTikTokData(tiktokRaw);
    const popupData = normalizePopupData(popupRaw);

    // Combine data from all sources
    const combinedData = [...etsyData, ...tiktokData, ...popupData];

    if (combinedData.length === 0) {
      console.warn('No live data available; falling back to backup data.');
      return loadBackupData();
    }

    return combinedData;
  } catch (error) {
    console.error('Error fetching live data. Falling back to backup data.', error);
    return loadBackupData();
  }
}
