// js/leetTable.js
import { FILTER_HEADERS } from './const.js';

export function renderTable(data) {
    const headers = data[0];
    const filteredHeaderIndices = headers.reduce((acc, header, index) => {
        if (FILTER_HEADERS.includes(header)) {
            acc[header] = index;
        }
        return acc;
    }, {});

    const tableHeaders = FILTER_HEADERS.map(header => `<th>${header}</th>`).join('');
    $('#sheetDataTable thead').html(`<tr>${tableHeaders}</tr>`);

    const tableData = data.slice(1).map(row => {
        return FILTER_HEADERS.map(header => {
            const index = filteredHeaderIndices[header];
            return index !== undefined ? row[index] : '';
        });
    });

    if ($.fn.DataTable.isDataTable('#sheetDataTable')) {
        $('#sheetDataTable').DataTable().destroy();
    }

    $('#sheetDataTable').DataTable({
        data: tableData,
        columns: FILTER_HEADERS.map(header => ({ title: header })),
        pageLength: 25,
        lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
}

export function initializeDataTable() {
    $('#sheetDataTable').DataTable({
        responsive: true,
        pageLength: 25,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
}