// js/render.js

function renderTable(data) {
    // Check if DataTable is already initialized and destroy it if necessary
    if ($.fn.DataTable.isDataTable('#sheetDataTable')) {
        const tableElement = $('#sheetDataTable').DataTable();
        tableElement.clear();
        tableElement.destroy();
    }

    const tableContainer = document.getElementById('sheetDataTable');
    
    // Clear existing headers and rows
    tableContainer.querySelector('thead').innerHTML = '';
    tableContainer.querySelector('tbody').innerHTML = '';

    let headers = '<tr>';
    
    // Render headers
    data[0].forEach(header => {
        headers += `<th>${header}</th>`;
    });
    headers += '</tr>';

    // Append headers to table
    tableContainer.querySelector('thead').innerHTML = headers;

    // Prepare data for DataTable (Data without the headers)
    const tableData = data.slice(1).map(row => {
        return row.map(cell => cell || "");  // Replace null or undefined values with an empty string
    });

    // Initialize DataTable with dynamic data
    $('#sheetDataTable').DataTable({
        data: tableData,
        columns: data[0].map(header => ({ title: header })),
        pageLength: 25,
        lengthMenu: [25, 50, 100],
        destroy: true
    });
}
