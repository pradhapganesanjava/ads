// js/sheetOperations.js
import { SPREADSHEET_ID, RANGE, FILTER_RANGE } from './const.js';

export async function fetchSheetData() {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: SPREADSHEET_ID,
            ranges: [RANGE, FILTER_RANGE],
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING'
        });

        const ranges = response.result.valueRanges;
        if (!ranges || ranges.length === 0) {
            throw new Error('No values found.');
        }

        const mainData = ranges[0].values;
        const filterData = ranges[1].values;

        if (!mainData || mainData.length === 0) {
            throw new Error('No main data found.');
        }

        return {
            mainData,
            filterData: filterData || []
        };
    } catch (err) {
        console.error('Error fetching sheet data:', err);
        throw err;
    }
}

export function getFilterData(data) {
    return data.filterData;
}