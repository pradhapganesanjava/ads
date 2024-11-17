// js/filterUi.js
import { renderTable } from './leetTable.js';
import { renderFilterSols } from './filterSols.js';

let globalData = null;
let allCategories = null;

export function renderFilters(filterDataJson) {
    if (!filterDataJson || filterDataJson.length === 0) {
        console.error('Invalid filter data');
        return;
    }

    allCategories = {};
    filterDataJson.forEach(item => {
        const category = item.CATEGORY;
        if (!allCategories[category]) {
            allCategories[category] = [];
        }
        allCategories[category].push({ name: item.NAME, key: item.KEY, active: false });
    });

    updateFilterList();
}

function toggleFilter(event) {
    const button = event.target;
    const category = button.dataset.category;
    const name = button.dataset.name;
    
    allCategories[category].forEach(item => {
        if (item.name === name) {
            item.active = !item.active;
        }
    });
    
    updateFilterList();
}

function updateFilterList() {
    const filterSection = document.querySelector('.filter-section');
    filterSection.innerHTML = ''; // Clear existing content

    // Render categories and items
    Object.entries(allCategories).forEach(([category, items]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'filter-category mb-3';
        categoryDiv.innerHTML = `<h5>${category}</h5>`;

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'd-flex flex-wrap';

        // Sort items: active first, then alphabetically
        items.sort((a, b) => {
            if (a.active === b.active) {
                return a.name.localeCompare(b.name);
            }
            return a.active ? -1 : 1;
        });

        items.forEach(({ name, key, active }) => {
            const button = document.createElement('button');
            button.className = `btn btn-outline-primary btn-sm m-1 filter-item${active ? ' active' : ''}`;
            button.textContent = name;
            button.dataset.category = category;
            button.dataset.key = key;
            button.dataset.name = name;
            button.onclick = toggleFilter;
            itemsDiv.appendChild(button);
        });

        categoryDiv.appendChild(itemsDiv);
        filterSection.appendChild(categoryDiv);
    });

    if (globalData) {
        const activeFilters = Object.values(allCategories).flat().filter(item => item.active);
        const filteredData = applyFilter(globalData, activeFilters);
        renderTable(filteredData);
        // clearActiveFilterSols(); // Clear active filter sols before rendering
        renderFilterSols(filteredData);
    }
}

function applyFilter(globalData, activeFilters) {
    if (!activeFilters || activeFilters.length === 0) {
        return globalData;
    }

    return globalData.filter(row => {
        return activeFilters.every(filter => {
            // Check if the filter is for tags
            return Array.isArray(row.tags) && row.tags.some(tag =>
                tag.toLowerCase() === filter.name.toLowerCase()
            );
        });
    });
}

export function setGlobalData(data) {
    globalData = data;
}