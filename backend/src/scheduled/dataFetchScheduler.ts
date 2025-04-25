import cron from 'node-cron';
import { fetchAllSalesData } from '../controllers/salesController';

export function scheduleDataFetch() {
  // Schedule to run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Scheduled data fetch started.');
    try {
      await fetchAllSalesData();
      console.log('Scheduled data fetch completed.');
    } catch (error) {
      console.error('Scheduled data fetch failed:', error);
    }
  });
}
