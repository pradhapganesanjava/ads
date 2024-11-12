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
        if (FILTER_HEADERS.includes(header) || header === 'link') {
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

    //         return `<a href="${link}" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href, '_blank', 'width=1200,height=800'); return false;">${title}</a>`;

    const tableData = filteredData.map(row => {
        return FILTER_HEADERS.map(header => {
            const index = filteredHeaderIndices[header];
            if (header === 'title') {
                const titleIndex = filteredHeaderIndices['title'];
                const linkIndex = filteredHeaderIndices['link'];
                const title = row[titleIndex];
                const link = row[linkIndex];
                return `<a href="#" onclick="showIframe('${link}', '${title}'); return false;">${title}</a>`;
            }
            return index !== undefined ? row[index] : '';
        });
    });

    if ($.fn.DataTable.isDataTable('#sheetDataTable')) {
        $('#sheetDataTable').DataTable().destroy();
    }

    $('#sheetDataTable').DataTable({
        data: tableData,
        columns: FILTER_HEADERS.map(header => ({ 
            title: header,
            render: function(data, type, row) {
                if (type === 'display' && header === 'title') {
                    return data;  // Return the HTML string for the link
                }
                return data;
            }
        })),
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