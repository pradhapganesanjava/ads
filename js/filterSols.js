// js/filterSols.js

import { renderTable } from './leetTable.js';

// let globalData = null;
let filteredData = null;
let activeFilterSols = [];

export function renderFilterSols(data) {

    if (!data || data.length === 0) {
        console.warn('No data to render filter sols');
        return;
    }

    filteredData = data;

    const filterSolsSection = document.querySelector('.filter-sols-section');
    filterSolsSection.innerHTML = ''; // Clear existing content

    // Sort activeFilterSols
    activeFilterSols.sort((a, b) => a.tag.localeCompare(b.tag));

    renderTagSection(filteredData, filterSolsSection, 'Tags', 'tags');
    renderTagSection(filteredData, filterSolsSection, 'Relation Tags', 'relation_tag');
}

function renderTagSection(data, container, title, tagType) {

    if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn(`No data to render for ${title}`);
        return;
    }

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'filter-sols-section mb-3';
    sectionDiv.innerHTML = `<h5>${title}</h5>`;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'd-flex flex-wrap';

    const allTags = data.flatMap(item => item[tagType] || []);
    const uniqueTags = [...new Set(allTags)];

    // Sort tags: active first, then alphabetically
    const sortedTags = uniqueTags.sort((a, b) => {
        const aActive = activeFilterSols.some(filter => filter.tag === a && filter.tagType === tagType);
        const bActive = activeFilterSols.some(filter => filter.tag === b && filter.tagType === tagType);
        if (aActive === bActive) {
            return a.localeCompare(b);
        }
        return aActive ? -1 : 1;
    });

    sortedTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-sm m-1 filter-sols-item';
        button.textContent = tag.trim();
        button.dataset.tag = tag.trim();
        button.dataset.tagType = tagType;
        button.onclick = toggleFilterSols;
        if (activeFilterSols.some(filter => filter.tag === tag && filter.tagType === tagType)) {
            button.classList.add('active');
        }
        tagsDiv.appendChild(button);
    });

    sectionDiv.appendChild(tagsDiv);
    container.appendChild(sectionDiv);
}

function toggleFilterSols(event) {
    const button = event.target;
    button.classList.toggle('active');
    updateActiveFilterSols();
    applyFilters();
}

function updateActiveFilterSols() {
    activeFilterSols = Array.from(document.querySelectorAll('.filter-sols-item.active')).map(button => ({
        tag: button.dataset.tag,
        tagType: button.dataset.tagType
    }));
    // Sort activeFilterSols
    activeFilterSols.sort((a, b) => a.tag.localeCompare(b.tag));
}

function applyFilters() {
    if (filteredData) {
        filteredData = filteredData.filter(item => {
            if (activeFilterSols.length === 0) return true;
            return activeFilterSols.every(filter => 
                    (item[filter.tagType] && Array.isArray(item[filter.tagType]) && item[filter.tagType].includes(filter.tag))
                );
            });
        renderTable(filteredData);
        renderFilterSols(filteredData);
    }
}

export function setGlobalData(data) {
    // globalData = data;
    filteredData = data;
}

export function updateFilterSols(data) {

    if (!data || data.length === 0) {
        console.warn('No data to update filter sols');
        return;
    }
    filteredData = data;
    // clearActiveFilterSols();
    renderFilterSols(filteredData);
}

export function clearActiveFilterSols() {
    activeFilterSols = [];
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