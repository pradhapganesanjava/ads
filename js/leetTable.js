// js/leetTable.js
import { FILTER_HEADERS } from './const.js';

export function renderTable(filteredData) {
    const tableElement = document.getElementById('sheetDataTable');
    if (!tableElement) {
        console.error('Table element not found');
        return;
    }
    
    const tableHeaders = FILTER_HEADERS.map(header => `<th>${header}</th>`).join('');
    $('#sheetDataTable thead').html(`<tr>${tableHeaders}</tr>`);

    const tableData = filteredData.map(row => {
        return FILTER_HEADERS.map(header => {
            if (header === 'title') {
                return `<a href="${row.link}" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href, '_blank', 'width=1200,height=800'); return false;">${row.title}</a>`;
            } else if (header === 'tags') {
                return Array.isArray(row.tags) ? row.tags.join(', ') : row.tags;
            } else if (header === 'relation_tag') {
                return Array.isArray(row.relation_tag) ? row.relation_tag.join(', ') : row.relation_tag;
            }
            return row[header] !== undefined ? row[header] : '';
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
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        autoWidth: false,
        dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
}