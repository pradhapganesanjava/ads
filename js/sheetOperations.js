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

export async function listMajors() {
    let response;
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('content').innerText = 'No values found.';
        return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        'Name, Major:\n');
    document.getElementById('content').innerText = output;
}