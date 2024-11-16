// js/filterSols.js

import { renderTable } from './leetTable.js';

let globalData = null;
let filteredData = null;

export function renderFilterSols(activeFilters = []) {
    if (!globalData) {
        console.error('Global data not set');
        return;
    }

    // Filter globalData based on activeFilters from filterUi
    filteredData = globalData.filter(item => {
        if (activeFilters.length === 0) return true;
        return activeFilters.every(filter => item[filter.key] === '1' || item[filter.key] === 'true' || item[filter.key] === 'yes');
    });

    // Get unique IDs from filteredData
    const uniqueIds = [...new Set(filteredData.map(item => item.id))];

    // Fetch globalData records matching these IDs
    const relevantData = globalData.filter(item => uniqueIds.includes(item.id));

    const filterSolsSection = document.querySelector('.filter-sols-section');
    filterSolsSection.innerHTML = ''; // Clear existing content

    // Render tags section
    renderTagSection(relevantData, filterSolsSection, 'Tags', item => item.tags ? item.tags.split(',') : []);

    // Render relation_tags section
    renderTagSection(relevantData, filterSolsSection, 'Relation Tags', item => item.relation_tags ? item.relation_tags.split(',') : []);
}

function renderTagSection(data, container, title, getTagsFunc) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'filter-sols-section mb-3';
    sectionDiv.innerHTML = `<h5>${title}</h5>`;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'd-flex flex-wrap';

    const allTags = data.flatMap(getTagsFunc);
    const uniqueTags = [...new Set(allTags)];

    uniqueTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-sm m-1 filter-sols-item';
        button.textContent = tag.trim();
        button.dataset.tag = tag.trim();
        button.onclick = toggleFilterSols;
        tagsDiv.appendChild(button);
    });

    sectionDiv.appendChild(tagsDiv);
    container.appendChild(sectionDiv);
}

function toggleFilterSols(event) {
    const button = event.target;
    button.classList.toggle('active');
    updateFilterSolsList();
}

function updateFilterSolsList() {
    const activeFilterSols = Array.from(document.querySelectorAll('.filter-sols-item.active')).map(button => button.dataset.tag);
    console.log('Active filter sols:', activeFilterSols);
    if (globalData) {
        const filteredData = globalData.filter(item => {
            const itemTags = (item.tags ? item.tags.split(',') : []).concat(item.relation_tags ? item.relation_tags.split(',') : []);
            return activeFilterSols.length === 0 || activeFilterSols.some(tag => itemTags.includes(tag.trim()));
        });
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