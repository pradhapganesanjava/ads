// js/filterSols.js

import { renderTable } from './leetTable.js';

let globalData = null;
let filteredData = null;

export function renderFilterSols(filterData, activeFilters = []) {
    if (!globalData || !filterData || filterData.length < 2) {
        console.error('Invalid data');
        return;
    }

    // Filter globalData based on activeFilters from filterUi
    filteredData = globalData.filter(item => {
        if (activeFilters.length === 0) return true;
        return activeFilters.every(filter => item[filter.key] === '1' || item[filter.key] === 'true' || item[filter.key] === 'yes');
    });

    const filterSolsSection = document.querySelector('.filter-sols-section');
    filterSolsSection.innerHTML = ''; // Clear existing content

    // Get unique names from filteredData
    const uniqueNames = [...new Set(filteredData.map(item => item.title))];

    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'd-flex flex-wrap';

    uniqueNames.forEach(name => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-sm m-1 filter-sols-item';
        button.textContent = name;
        button.dataset.name = name;
        button.onclick = toggleFilterSols;
        itemsDiv.appendChild(button);
    });

    filterSolsSection.appendChild(itemsDiv);
}

function toggleFilterSols(event) {
    const button = event.target;
    button.classList.toggle('active');
    updateFilterSolsList();
}

function updateFilterSolsList() {
    const activeFilterSols = Array.from(document.querySelectorAll('.filter-sols-item.active')).map(button => button.dataset.name);
    console.log('Active filter sols:', activeFilterSols);
    if (globalData) {
        const filteredData = globalData.filter(item => activeFilterSols.length === 0 || activeFilterSols.includes(item.title));
        renderTable(filteredData);
    }
}

export function setGlobalData(data) {
    globalData = data;
}

export function updateFilterSols(activeFilters) {
    renderFilterSols(globalData, activeFilters);
}

export function setupFilterSolsToggle() {
    const toggleFilterSolsBtn = document.getElementById('toggleFilterSols');
    const expandFilterSolsBtn = document.getElementById('expandFilterSols');
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    const contentColumn = document.getElementById('contentColumn');

    if (toggleFilterSolsBtn && expandFilterSolsBtn && filterSolsColumn && contentColumn) {
        toggleFilterSolsBtn.addEventListener('click', () => {
            filterSolsColumn.classList.toggle('collapsed');
            filterSolsColumn.classList.toggle('filter-sols-open');
            contentColumn.classList.toggle('filter-sols-open');
        });

        expandFilterSolsBtn.addEventListener('click', () => {
            filterSolsColumn.classList.remove('collapsed');
            filterSolsColumn.classList.add('filter-sols-open');
            contentColumn.classList.add('filter-sols-open');
        });
    }
}