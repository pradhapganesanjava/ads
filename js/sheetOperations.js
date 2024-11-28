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

        // Convert mainData to JSON
        const mainHeaders = mainData[0];
        const mainDataJson = mainData.slice(1).map(row => {
            return mainHeaders.reduce((obj, header, index) => {
                if (header === 'tags' || header === 'relation_tag') {
                    obj[header] = row[index] ? row[index].split('^').map(item => item.trim()) : [];
                } else {
                obj[header] = row[index];
                }
                return obj;
            }, {});
        });

        // Convert filterData to JSON
        const filterHeaders = filterData[0];
        const filterDataJson = filterData.slice(1).map(row => {
            return filterHeaders.reduce((obj, header, index) => {
                obj[header] = row[index];
                return obj;
            }, {});
        });

        return {
            mainDataJson,
            filterDataJson
        };
    } catch (err) {
        console.error('Error fetching sheet data:', err);
        throw err;
    }
}

export function getFilterData(data) {
    return data.filterData;
}