// js/sheetOperations.js
import { SPREADSHEET_ID, RANGE } from './const.js';

export async function fetchSheetData() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
        
        const range = response.result;
        if (!range || !range.values || range.values.length == 0) {
            throw new Error('No values found.');
        }
        
        return range.values;
    } catch (err) {
        console.error('Error fetching sheet data:', err);
        throw err;
    }
}