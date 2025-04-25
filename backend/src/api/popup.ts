import { parseCSVFile } from '../utils/csvParser';

export async function fetchPopupSales(filePath: string) {
  try {
    // For now, we assume there's a CSV file at a given path. In production, you might receive file uploads.
    const popupData = await parseCSVFile(filePath);
    return popupData;
  } catch (error) {
    console.error('Error parsing pop-up sales CSV:', error);
    throw error;
  }
}
