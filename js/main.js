// js/main.js
import { CONFIG } from './config.js';
import { initializeApp } from './app.js';
import { updateState } from './state.js';
import { initUI } from './ui.js';
import { handleError } from './error.js';
import { handleAuth, handleSignout } from './auth.js';
import { fetchSheetData } from './sheetOperations.js';
import { renderTable } from './leetTable.js';
import { renderFilters, setGlobalData } from './filterUi.js';

async function init() {
    try {
        await initializeApp(CONFIG);
        initUI();
        setupEventListeners();
        updateState({ isInitialized: true });
    } catch (error) {
        handleError(error);
    }
}

function setupEventListeners() {
    document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
    document.getElementById('signout_button').addEventListener('click', handleSignoutClick);

    // Add event listener for closing the iframe
    const closeButton = document.querySelector('#iframeContainer .close');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            $('#iframeContainer').collapse('hide');
        });
    } else {
        console.warn('Close button for iframe not found');
    }
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
        const { mainData, filterData } = await fetchSheetData();
        setGlobalData(mainData);
        renderTable(mainData);
        renderFilters(filterData);
    } catch (error) {
        handleError(error);
    } finally {
        updateState({ isLoading: false });
    }
}

document.addEventListener('DOMContentLoaded', init);

// Add the showIframe function here
window.showIframe = function (url, title) {
    const iframe = document.getElementById('contentIframe');
    const iframeContainer = document.getElementById('iframeContainer');
    const iframeTitle = document.getElementById('iframeTitle');

    if (iframe && iframeContainer && iframeTitle) {
        iframe.src = url;
        iframeTitle.textContent = title;

        $(iframeContainer).collapse('show');

        // Scroll to the iframe
        iframeContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Required elements for iframe not found');
    }
}