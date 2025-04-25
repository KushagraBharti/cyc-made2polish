import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ETSY_API_URL = process.env.ETSY_API_URL;
const ETSY_ACCESS_TOKEN = process.env.ETSY_ACCESS_TOKEN;

export async function fetchEtsyReceipts() {
  try {
    const response = await axios.get(ETSY_API_URL as string, {
      headers: {
        Authorization: `Bearer ${ETSY_ACCESS_TOKEN}`
      },
      params: {
        limit: 50
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Etsy receipts:', error);
    throw error;
  }
}
