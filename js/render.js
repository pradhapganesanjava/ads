function renderTable(data) {
    // Clear existing data
    const tableElement = $('#sheetDataTable').DataTable();
    tableElement.clear();
    tableElement.destroy();

    const tableContainer = document.getElementById('sheetDataTable');
    let headers = '<tr>';
    
    // Render headers
    data[0].forEach(header => {
        headers += `<th>${header}</th>`;
    });
    headers += '</tr>';

    // Append headers to table
    tableContainer.querySelector('thead').innerHTML = headers;

    // Initialize DataTable with dynamic data
    $(document).ready(function () {
        $('#sheetDataTable').DataTable({
            data: data.slice(1), // Data without the headers
            columns: data[0].map(header => ({ title: header })),
            pageLength: 25,
            lengthMenu: [25, 50, 100],
            destroy: true
        });
    });
}