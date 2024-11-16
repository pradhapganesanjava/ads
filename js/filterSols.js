// js/filterSols.js

import { renderTable } from './leetTable.js';

let globalData = null;
let filteredData = null;

export function renderFilterSols(data) {
    filteredData = data;
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
    const activeFilterSols = Array.from(document.querySelectorAll('.filter-sols-item.active')).map(button => ({
        tag: button.dataset.tag,
        tagType: button.dataset.tagType
    }));
    
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
    globalData = data;
    filteredData = data;
}

export function updateFilterSols(data) {
    filteredData = data;
    renderFilterSols(filteredData);
}

export function setupFilterSolsToggle() {
    const toggleFilterSolsBtn = document.getElementById('collapseFilterSols');
    const expandFilterSolsBtn = document.getElementById('expandFilterSols');
    const filterSolsColumn = document.getElementById('filterSolsColumn');
    const contentColumn = document.getElementById('contentColumn');

    if (toggleFilterSolsBtn && expandFilterSolsBtn && filterSolsColumn && contentColumn) {
        toggleFilterSolsBtn.addEventListener('click', () => {
            filterSolsColumn.classList.toggle('collapsed');
            contentColumn.classList.toggle('filter-sols-open');
        });

        expandFilterSolsBtn.addEventListener('click', () => {
            filterSolsColumn.classList.remove('collapsed');
            contentColumn.classList.add('filter-sols-open');
        });
    }
}