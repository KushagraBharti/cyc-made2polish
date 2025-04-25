import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fetchAllSalesData } from './controllers/salesController';
import cron from 'node-cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to get the normalized sales data
app.get('/api/sales', async (req, res) => {
  try {
    const salesData = await fetchAllSalesData();
    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Failed to fetch sales data.' });
  }
});

// Schedule a daily data fetch
cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled data fetch...');
  try {
    await fetchAllSalesData();
    console.log('Data fetch completed.');
  } catch (error) {
    console.error('Scheduled data fetch failed:', error);
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
