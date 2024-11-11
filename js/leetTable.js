// js/leetTable.js
export function renderTable(data) {
    const table = $('#sheetDataTable').DataTable();
    table.clear();
    
    // Assuming the first row contains headers
    const headers = data[0];
    const tableHeaders = headers.map(header => `<th>${header}</th>`).join('');
    $('#sheetDataTable thead').html(`<tr>${tableHeaders}</tr>`);
    
    // Add data rows
    const tableData = data.slice(1).map(row => {
        return row.map(cell => `<td>${cell}</td>`).join('');
    });
    
    table.rows.add($(tableData.map(row => `<tr>${row}</tr>`)));
    table.columns.adjust().draw();
}

export function initializeDataTable() {
    $('#sheetDataTable').DataTable({
        responsive: true,
        pageLength: 25,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
}