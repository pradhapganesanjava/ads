// js/main.js
import { initializeApp } from './app.js';
import { fetchSheetData } from './sheetOperations.js';
import { renderTable } from './leetTable.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    // Add click event for the authorize button
    const authorizeButton = document.getElementById('authorize_button');
    if (authorizeButton) {
        authorizeButton.addEventListener('click', async () => {
            await loadAndRenderData();
        });
    } else {
        console.error('Authorize button not found');
    }
});

async function loadAndRenderData() {
    console.log('Loading and rendering data');
    try {
        const data = await fetchSheetData();
        console.log('Loading and rendering data: ' + data);
        renderTable(data);
    } catch (error) {
        console.error('Error loading and rendering data:', error);
        $('#content').text('Error: ' + error.message);
    }
}
