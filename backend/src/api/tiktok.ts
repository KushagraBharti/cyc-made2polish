import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TIKTOK_API_URL = process.env.TIKTOK_API_URL;
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

export async function fetchTikTokOrders() {
  try {
    const response = await axios.get(TIKTOK_API_URL as string, {
      headers: {
        Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`
      },
      params: {
        limit: 50
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TikTok orders:', error);
    throw error;
  }
}
