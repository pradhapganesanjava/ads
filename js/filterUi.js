// js/filterUi.js
import { renderTable } from './leetTable.js';
import { updateFilterSols } from './filterSols.js';

let globalData = null;

export function renderFilters(filterData) {
    if (!filterData || filterData.length < 2) {
        console.error('Invalid filter data');
        return;
    }

    const [headers, ...data] = filterData;
    const categoryIndex = headers.indexOf('CATEGORY');
    const nameIndex = headers.indexOf('NAME');
    const keyIndex = headers.indexOf('KEY');

    if (categoryIndex === -1 || nameIndex === -1 || keyIndex === -1) {
        console.error('Required columns not found in filter data');
        return;
    }

    const categories = {};
    data.forEach(row => {
        const category = row[categoryIndex];
        const name = row[nameIndex];
        const key = row[keyIndex];
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push({ name, key });
    });

    const filterSection = document.querySelector('.filter-section');
    filterSection.innerHTML = ''; // Clear existing content

    Object.entries(categories).forEach(([category, items]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'filter-category mb-3';
        categoryDiv.innerHTML = `<h5>${category}</h5>`;

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'd-flex flex-wrap';

        items.forEach(({ name, key }) => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary btn-sm m-1 filter-item';
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
}

function toggleFilter(event) {
    const button = event.target;
    button.classList.toggle('active');
    updateFilterList();
}

function updateFilterList() {
    const activeFilters = Array.from(document.querySelectorAll('.filter-item.active')).map(button => ({
        category: button.dataset.category,
        key: button.dataset.key,
        name: button.dataset.name
    }));
    console.log('Active filters:', activeFilters);
    if (globalData) {
        renderTable(globalData, activeFilters);
        updateFilterSols(activeFilters);  // Add this line
    }
}

export function setGlobalData(data) {
    globalData = data;
}