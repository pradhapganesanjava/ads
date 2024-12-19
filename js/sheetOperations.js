// js/sheetOperations.js
import { GDRIVE_FB_PROBS, FB_ALL_SHEET, FILTER_SHEET, ANKI_NID_SHEET } from './const.js';
import { getFileIdFromPath } from './gDriveService.js';

export async function fetchSheetData() {
    try {
        const sheet_id = await getFileIdFromPath(GDRIVE_FB_PROBS);
        console.log('Sheet ID:', sheet_id);

        const response = await gapi.client.sheets.spreadsheets.values.batchGet({
            spreadsheetId: sheet_id,
            ranges: [FB_ALL_SHEET, FILTER_SHEET, ANKI_NID_SHEET],
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'FORMATTED_STRING'
        });

        const ranges = response.result.valueRanges;
        if (!ranges || ranges.length === 0) {
            throw new Error('No values found.');
        }

        const mainData = ranges[0].values;
        const filterData = ranges[1].values;
        const ankiNidData = ranges[2].values;

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

        // Convert ankiNidData to JSON
        const ankiNidHeaders = ankiNidData[0];
        const ankiNidDataJson = ankiNidData.slice(1).map(row => {
            return ankiNidHeaders.reduce((obj, header, index) => {
                obj[header] = row[index];
                return obj;
            }, {});
        });

        return {
            mainDataJson,
            filterDataJson,
            ankiNidDataJson
        };
    } catch (err) {
        console.error('Error fetching sheet data:', err);
        throw err;
    }
}

export function getFilterData(data) {
    return data.filterData;
}

export function getAnkiNidData(data) {
    return data.ankiNidDataJson;
}
