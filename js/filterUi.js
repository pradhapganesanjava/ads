// js/filterUi.js
import { renderTable } from './leetTable.js';
import { updateFilterSols } from './filterSols.js';

let globalData = null;

export function renderFilters(filterDataJson) {
    if (!filterDataJson || filterDataJson.length === 0) {
        console.error('Invalid filter data');
        return;
    }

    const categories = {};
    filterDataJson.forEach(item => {
        const category = item.CATEGORY;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push({ name: item.NAME, key: item.KEY });
    });

    updateFilterList(categories);
}

function toggleFilter(event) {
    const button = event.target;
    button.classList.toggle('active');
    updateFilterList();
}

function updateFilterList(categories = null) {
    const activeFilters = Array.from(document.querySelectorAll('.filter-item.active')).map(button => ({
        category: button.dataset.category,
        key: button.dataset.key,
        name: button.dataset.name
    }));

    // Sort active filters alphabetically
    activeFilters.sort((a, b) => a.name.localeCompare(b.name));

    console.log('Active filters:', activeFilters);

    const filterSection = document.querySelector('.filter-section');
    filterSection.innerHTML = ''; // Clear existing content

    // If categories are not provided, extract them from existing buttons
    if (!categories) {
        categories = {};
        document.querySelectorAll('.filter-item').forEach(button => {
            const category = button.dataset.category;
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({
                name: button.dataset.name,
                key: button.dataset.key,
                active: button.classList.contains('active')
            });
        });
    }

    // Render categories and items
    Object.entries(categories).forEach(([category, items]) => {
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
        const filteredData = applyFilter(globalData, activeFilters);
        renderTable(filteredData);
        updateFilterSols(filteredData);
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