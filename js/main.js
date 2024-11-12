// js/main.js
import { initializeApp } from './app.js';
import { handleAuth, handleSignout } from './auth.js';
import { fetchSheetData } from './sheetOperations.js';
import { renderTable } from './leetTable.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function setupEventListeners() {
    const authorizeButton = document.getElementById('authorize_button');
    const signoutButton = document.getElementById('signout_button');

    if (authorizeButton) {
        authorizeButton.addEventListener('click', handleAuthClick);
    } else {
        console.error('Authorize button not found');
    }

    if (signoutButton) {
        signoutButton.addEventListener('click', handleSignoutClick);
    } else {
        console.error('Signout button not found');
    }
}

async function handleAuthClick() {
    try {
        const isAuthorized = await handleAuth();
        if (isAuthorized) {
            updateButtonsState(true);
            await loadAndRenderData();
        }
    } catch (error) {
        console.error('Authentication failed:', error);
        document.getElementById('content').textContent = error.message;
    }
}

function handleSignoutClick() {
    if (handleSignout()) {
        updateButtonsState(false);
        clearTable();
        document.getElementById('content').textContent = 'Signed out successfully.';
    }
}

async function loadAndRenderData() {
    try {
        const data = await fetchSheetData();
        console.log('Fetched data:', data);
        renderTable(data);
    } catch (error) {
        console.error('Error fetching and rendering data:', error);
        document.getElementById('content').textContent = 'Error: ' + error.message;
    }
}

function updateButtonsState(isAuthorized) {
    const authorizeButton = document.getElementById('authorize_button');
    const signoutButton = document.getElementById('signout_button');

    if (isAuthorized) {
        signoutButton.style.display = 'block';
        authorizeButton.innerText = 'Refresh';
    } else {
        signoutButton.style.display = 'none';
        authorizeButton.innerText = 'Authorize';
    }
}

function clearTable() {
    if ($.fn.DataTable.isDataTable('#sheetDataTable')) {
        $('#sheetDataTable').DataTable().clear().destroy();
    }
}