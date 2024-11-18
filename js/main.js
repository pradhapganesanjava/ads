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
import { getGoodNotesADSFiles } from './gDriveService.js';

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
    document.getElementById('closeIframe').addEventListener('click', hideIframe);
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
    eventBus.subscribe('showIframe', showIframe);
    eventBus.subscribe('closeIframe', hideIframe);
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

function showIframe({ fileId, title }) {
    const iframeContainer = document.getElementById('iframeContainer');
    const tableContainer = document.getElementById('tableContainer');
    const pdfViewer = document.getElementById('pdfViewer');
    const iframeTitle = document.getElementById('iframeTitle');

    if (pdfViewer && iframeContainer && iframeTitle) {
        iframeTitle.textContent = title;
        
        // Construct PDF URL
        const pdfUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        
        // Use PDF.js to render the PDF
        pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                const scale = 1.5;
                const viewport = page.getViewport({ scale: scale });
                const context = pdfViewer.getContext('2d');
                
                pdfViewer.height = viewport.height;
                pdfViewer.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                page.render(renderContext);
                
                tableContainer.classList.add('d-none');
                iframeContainer.classList.remove('d-none');
            });
        }).catch(function(error) {
            console.error('Failed to load PDF with PDF.js', error);
            showFallback(fileId);
        });
    } else {
        console.error('Required elements for PDF viewer not found');
        showFallback(fileId);
    }
}

function showFallback(fileId) {
    const fallback = document.getElementById('iframeFallback');
    const openInNewTab = document.getElementById('openInNewTab');
    fallback.style.display = 'block';
    openInNewTab.href = `https://drive.google.com/file/d/${fileId}/view`;
    showTable();
}

function hideIframe() {
    const iframeContainer = document.getElementById('iframeContainer');
    const tableContainer = document.getElementById('tableContainer');

    iframeContainer.classList.add('d-none');
    tableContainer.classList.remove('d-none');

    // Clear the PDF viewer
    const pdfViewer = document.getElementById('pdfViewer');
    const context = pdfViewer.getContext('2d');
    context.clearRect(0, 0, pdfViewer.width, pdfViewer.height);
}

function showTable() {
    const iframeContainer = document.getElementById('iframeContainer');
    const tableContainer = document.getElementById('tableContainer');

    iframeContainer.classList.add('d-none');
    tableContainer.classList.remove('d-none');
}

function handleViewError(errorMessage) {
    console.error(errorMessage);
    eventBus.publish('showTable');
}

document.addEventListener('DOMContentLoaded', init);