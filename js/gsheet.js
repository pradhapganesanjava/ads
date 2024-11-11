// js/gsheet.js

async function loadSheetsData() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
    } catch (err) {
        document.getElementById('tableContainer').innerText = err.message;
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('tableContainer').innerText = 'No values found.';
        return;
    }
    console.log('Google Sheets API Response:', range);
    renderTable(range.values);
}