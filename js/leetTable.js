// js/leetTable.js
import { FILTER_HEADERS } from './const.js';

export function renderTable(data, activeFilters = []) {
    const tableElement = document.getElementById('sheetDataTable');
    if (!tableElement) {
        console.error('Table element not found');
        return;
    }
    
    const headers = data[0];
    const filteredHeaderIndices = headers.reduce((acc, header, index) => {
        if (FILTER_HEADERS.includes(header)) {
            acc[header] = index;
        }
        return acc;
    }, {});

    const tableHeaders = FILTER_HEADERS.map(header => `<th>${header}</th>`).join('');
    $('#sheetDataTable thead').html(`<tr>${tableHeaders}</tr>`);

    // Filter the data based on activeFilters
    const filteredData = data.slice(1).filter((row, rowIndex) => {
        if (activeFilters.length === 0) return true;
        return activeFilters.every(filter => {
            const columnIndex = headers.indexOf(filter.key);
            console.log(`Row ${rowIndex + 1}, Filter: ${filter.key}, Column Index: ${columnIndex}`);
            if (columnIndex !== -1) {
                const cellValue = row[columnIndex];
                console.log(`Cell Value: ${cellValue}, Type: ${typeof cellValue}`);
                // Less strict comparison
                return cellValue == 1 || cellValue === '1' || cellValue === 'true' || cellValue === 'yes';
            }
            // If the filter key is not a column name, check if it's a value in any of the columns
            const matchingColumn = headers.findIndex((header, index) => {
                const cellValue = row[index];
                return (cellValue == 1 || cellValue === '1' || cellValue === 'true' || cellValue === 'yes') && header === filter.key;
            });
            console.log(`Matching Column for ${filter.key}: ${matchingColumn}`);
            return matchingColumn !== -1;
        });
    });


    const tableData = filteredData.map(row => {
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
        scrollY: '100%',
        scrollCollapse: true,
        paging: true,
        dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
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