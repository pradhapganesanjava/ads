// js/filterSols.js

import { renderTable } from './leetTable.js';
import { applyFilters, getActiveFilters } from './filterUi.js';

let globalData = null;
let activeFilterSols = [];

export function renderFilterSols(filteredData) {
    if (!filteredData || filteredData.length === 0) {
        console.error('Filtered data not set or empty');
        return;
    }

    const filterSolsSection = document.querySelector('.filter-sols-section');
    filterSolsSection.innerHTML = ''; // Clear existing content

    renderTagSection(filteredData, filterSolsSection, 'Tags', 'tags');
    renderTagSection(filteredData, filterSolsSection, 'Relation Tags', 'relation_tag');
}

function renderTagSection(data, container, title, tagType) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'filter-sols-section mb-3';
    sectionDiv.innerHTML = `<h5>${title}</h5>`;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'd-flex flex-wrap';

    const allTags = data.flatMap(item => item[tagType] || []);
    const uniqueTags = [...new Set(allTags)];

    uniqueTags.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline-primary btn-sm m-1 filter-sols-item';
        button.textContent = tag.trim();
        button.dataset.tag = tag.trim();
        button.dataset.tagType = tagType;
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
    activeFilterSols = Array.from(document.querySelectorAll('.filter-sols-item.active')).map(button => ({
        tag: button.dataset.tag,
        tagType: button.dataset.tagType
    }));
    console.log('Active filter sols:', activeFilterSols);
    applyAllFilters();
}

function applyAllFilters() {
    if (globalData) {
        let filteredData = globalData;

        // Apply main filters
        const mainFilters = getActiveFilters();
        if (mainFilters.length > 0) {
            filteredData = filteredData.filter(row => {
                return mainFilters.every(filter => {
                    return Array.isArray(row.tags) && row.tags.some(tag =>
                        tag.toLowerCase() === filter.name.toLowerCase()
                    );
                });
            });
        }

        // Apply filter sols
        if (activeFilterSols.length > 0) {
            filteredData = filteredData.filter(item => {
                return activeFilterSols.some(filter =>
                    (item[filter.tagType] && Array.isArray(item[filter.tagType]) && item[filter.tagType].includes(filter.tag))
                );
            });
        }

        renderTable(filteredData);
        renderFilterSols(filteredData);
    }
}

export function setGlobalData(data) {
    globalData = data;
}

export function updateFilterSols(filteredData) {
    renderFilterSols(filteredData);
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