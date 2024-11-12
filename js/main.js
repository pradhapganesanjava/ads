// js/main.js
import { initializeApp } from './app.js';
import { fetchSheetData } from './sheetOperations.js';
import { renderTable, initializeDataTable } from './leetTable.js';

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
    try {
        const data = await fetchSheetData();
        renderTable(data);
    } catch (error) {
        console.error('Error loading and rendering data:', error);
        $('#content').text('Error: ' + error.message);
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     initializeApp();
//     initializeDataTable();
    
//     // Add click event for the authorize button
//     document.getElementById('authorize_button').addEventListener('click', async () => {
//         await loadAndRenderData();
//     });
// });