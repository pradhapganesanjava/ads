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
import { renderFilterSols, setupFilterSolsToggle } from './filterSols.js';
import { eventBus } from './eventBus.js';
import { getGoodNotesADSFiles, fetchPdfFromDrive } from './gDriveService.js';
import { renderPDF, closePdfViewer } from './pdfViewer.js';

async function init() {
    try {
        await initializeApp(CONFIG);
        initUI();
        setupEventListeners();
        setupFilterSolsToggle();
        updateState({ isInitialized: true });
    } catch (error) {
        handleError(error);
    }
}

function setupEventListeners() {
    document.getElementById('authorize_button').addEventListener('click', handleAuthClick);
    document.getElementById('signout_button').addEventListener('click', handleSignoutClick);
    document.getElementById('collapseFilters').addEventListener('click', toggleFilterColumn);
    document.getElementById('expandFilters').addEventListener('click', expandFilterColumn);
    document.getElementById('collapseFilterSols').addEventListener('click', toggleFilterSolsColumn);
    document.getElementById('expandFilterSols').addEventListener('click', expandFilterSolsColumn);

    setupEventSubscriptions();
}

function toggleFilterColumn() {
    const filterColumn = document.getElementById('filterColumn');
    filterColumn.classList.toggle('collapsed');
}

function expandFilterColumn() {
    const filterColumn = document.getElementById('filterColumn');
    filterColumn.classList.remove('collapsed');
}

function toggleFilterSolsColumn() {
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    filterSolsColumn.classList.toggle('collapsed');
}

function expandFilterSolsColumn() {
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    filterSolsColumn.classList.remove('collapsed');
}

function setupEventSubscriptions() {
    eventBus.subscribe('showPdfViewer', showPdfViewer);
    // eventBus.subscribe('closePdfViewer', closePdfViewer);
    eventBus.subscribe('showTable', showTable);
    eventBus.subscribe('error', handleViewError);
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
        const { mainData, filterData, mainDataJson, filterDataJson } = await fetchSheetData();
        await initDriveADSFiles(); // Load Drive files
        setGlobalData(mainDataJson);
        renderTable(mainDataJson);
        renderFilters(filterDataJson);
        renderFilterSols(mainDataJson);
        eventBus.publish('showTable');
    } catch (error) {
        handleError(error);
    } finally {
        updateState({ isLoading: false });
    }
}

async function initDriveADSFiles() {
    try {
        const files = await getGoodNotesADSFiles();
        console.log('Files in Drive:', files);
    } catch (error) {
        handleError(error);
    }
}
function showPdfViewer(fileId, title) {
    const width = 1200;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const pdfViewerUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    const newWindow = window.open(pdfViewerUrl, '_blank', `width=${width},height=${height},left=${left},top=${top}`);

    if (newWindow) {
        newWindow.focus();
    } else {
        console.error('Unable to open new window. Pop-up blocker may be enabled.');
        alert('Please allow pop-ups for this site to view the PDF.');
    }
}

function showTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.classList.remove('d-none');
}

function handleViewError(errorMessage) {
    console.error(errorMessage);
    eventBus.publish('showTable');
}

document.addEventListener('DOMContentLoaded', init);