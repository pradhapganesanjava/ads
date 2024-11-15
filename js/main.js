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
import { renderFilterSols, setGlobalData as setFilterSolsGlobalData, setupFilterSolsToggle } from './filterSols.js';
import { eventBus } from './eventBus.js';

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
}

function toggleFilterColumn() {
    const filterColumn = document.getElementById('filterColumn');
    const contentColumn = document.getElementById('contentColumn');
    filterColumn.classList.toggle('collapsed');
    contentColumn.classList.toggle('expanded-right');
    adjustContentColumnWidth();
}

function expandFilterColumn() {
    const filterColumn = document.getElementById('filterColumn');
    const contentColumn = document.getElementById('contentColumn');
    filterColumn.classList.remove('collapsed');
    contentColumn.classList.remove('expanded-right');
    adjustContentColumnWidth();
}

function toggleFilterSolsColumn() {
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    const contentColumn = document.getElementById('contentColumn');
    filterSolsColumn.classList.toggle('collapsed');
    contentColumn.classList.toggle('expanded-left');
    adjustContentColumnWidth();
}

function expandFilterSolsColumn() {
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    const contentColumn = document.getElementById('contentColumn');
    filterSolsColumn.classList.remove('collapsed');
    contentColumn.classList.remove('expanded-left');
    adjustContentColumnWidth();
}

function adjustContentColumnWidth() {
    const filterColumn = document.getElementById('filterColumn');
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    const contentColumn = document.getElementById('contentColumn');

    if (filterColumn.classList.contains('collapsed') && filterSolsColumn.classList.contains('collapsed')) {
        contentColumn.classList.add('col-md-11');
        contentColumn.classList.remove('col-md-5');
    } else if (filterColumn.classList.contains('collapsed') || filterSolsColumn.classList.contains('collapsed')) {
        contentColumn.classList.add('col-md-8');
        contentColumn.classList.remove('col-md-5', 'col-md-11');
    } else {
        contentColumn.classList.add('col-md-5');
        contentColumn.classList.remove('col-md-8', 'col-md-11');
    }
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
        const { mainData, filterData } = await fetchSheetData();
        setGlobalData(mainData);
        setFilterSolsGlobalData(mainData);
        renderTable(mainData);
        renderFilters(filterData);
        renderFilterSols(filterData);
        eventBus.publish('showTable');
    } catch (error) {
        handleError(error);
    } finally {
        updateState({ isLoading: false });
    }
}

function showIframe({ url, title }) {
    const iframeContainer = document.getElementById('iframeContainer');
    const tableContainer = document.getElementById('tableContainer');
        const iframe = document.getElementById('contentIframe');
        const iframeTitle = document.getElementById('iframeTitle');

    if (iframe && iframeContainer && iframeTitle) {
            iframe.src = url;
            iframeTitle.textContent = title;

        tableContainer.classList.add('d-none');
        iframeContainer.classList.remove('d-none');
    } else {
            console.error('Required elements for iframe not found');
            eventBus.publish('error', 'Failed to load iframe');
    }
}

function hideIframe() {
    eventBus.publish('showTable');
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