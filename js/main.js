// js/main.js
import { initializeApp } from './app.js';
import { listMajors } from './sheetOperations.js';
import { renderTable, initializeDataTable } from './leetTable.js';

async function loadAndRenderData() {
    try {
        const data = await listMajors();
        renderTable(data);
    } catch (error) {
        console.error('Error loading and rendering data:', error);
        $('#content').text('Error: ' + error.message);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeDataTable();
    
    // Add click event for the authorize button
    document.getElementById('authorize_button').addEventListener('click', async () => {
        await loadAndRenderData();
    });
});