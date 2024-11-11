// js/sheetOperations.js

import { SPREADSHEET_ID, RANGE } from './const.js';

export async function listMajors() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        updateContent('Error: ' + err.message);
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        updateContent('No values found.');
        return;
    }
    // Flatten to string to display
    const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        'Name, Major:\n');
    updateContent(output);
}

function updateContent(text) {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.innerText = text;
    } else {
        console.warn('Element with id "content" not found. Content:', text);
    }
}