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
        const closeButton = document.getElementById('closeIframe');
        if (closeButton) {
            closeButton.addEventListener('click', hideIframe);
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
        const contentColumn = document.getElementById('contentColumn');
        const iframeContainer = document.getElementById('iframeContainer');
        const iframe = document.getElementById('contentIframe');
        const iframeTitle = document.getElementById('iframeTitle');

        if (iframe && iframeContainer && iframeTitle) {
            iframe.src = url;
            iframeTitle.textContent = title;

            // Hide all direct children of contentColumn except iframeContainer
            Array.from(contentColumn.children).forEach(child => {
                if (child !== iframeContainer) {
                    child.style.display = 'none';
                }
            });

            iframeContainer.style.display = 'flex';
        } else {
            console.error('Required elements for iframe not found');
        }
    }

    window.hideIframe = function () {
        const contentColumn = document.getElementById('contentColumn');
        const iframeContainer = document.getElementById('iframeContainer');

        if (iframeContainer) {
            iframeContainer.style.display = 'none';

            // Show all other direct children of contentColumn
            Array.from(contentColumn.children).forEach(child => {
                if (child !== iframeContainer) {
                    child.style.display = '';
                }
            });
        }
    }