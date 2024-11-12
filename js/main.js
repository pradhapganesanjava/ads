// js/main.js
import { CONFIG } from './config.js';
import { initializeApp } from './app.js';
import { updateState, state } from './state.js';
import { updateUI } from './ui.js';
import { handleError } from './error.js';
import { handleAuth, handleSignout } from './auth.js';
import { fetchSheetData } from './sheetOperations.js';
import { renderTable } from './leetTable.js';

async function init() {
    try {
        await initializeApp(CONFIG);
        setupEventListeners();
        updateUI();
    } catch (error) {
        handleError(error);
    }
}

function setupEventListeners() {
    document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
    document.getElementById('signout_button').addEventListener('click', handleSignoutClick);
}

async function handleAuthClick() {
    try {
        updateState({ isLoading: true });
        const isAuthorized = await handleAuth();
        updateState({ isAuthorized, isLoading: false });
        if (isAuthorized) {
            await loadAndRenderData();
        }
    } catch (error) {
        handleError(error);
    }
}

function handleSignoutClick() {
    if (handleSignout()) {
        updateState({ isAuthorized: false });
        clearTable();
    }
}

async function loadAndRenderData() {
    try {
        updateState({ isLoading: true });
        const data = await fetchSheetData();
        renderTable(data);
    } catch (error) {
        handleError(error);
    } finally {
        updateState({ isLoading: false });
    }
}

document.addEventListener('DOMContentLoaded', init);