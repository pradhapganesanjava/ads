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
        return activeFilters.some(filter => {
            const cellValue = row[filter.key];
            const isTagMatch = Array.isArray(row.tags) && row.tags.some(tag => tag.toLowerCase() === filter.name.toLowerCase());
            return cellValue == 1 || cellValue === '1' || cellValue === 'true' || cellValue === 'yes' || isTagMatch;
        });
    });
}

function applyFilterByName(data, activeFilters) {
    // Filter the data based on activeFilters
    const filteredData = data.slice(1).filter((row, rowIndex) => {
        if (activeFilters.length === 0) return true;
        return activeFilters.every(filter => {
            const columnIndex = headers.indexOf(filter.key);
            console.log(`Row ${rowIndex + 1}, Filter: ${filter.key}, Column Index: ${columnIndex}`);
            if (columnIndex !== -1) {
                const cellValue = row[columnIndex];
                console.log(`Cell Value: ${cellValue}, Type: ${typeof cellValue}`);
                // Less strict comparison
                return cellValue == 1 || cellValue === '1' || cellValue === 'true' || cellValue === 'yes';
            }
            // If the filter key is not a column name, check if it's a value in any of the columns
            const matchingColumn = headers.findIndex((header, index) => {
                const cellValue = row[index];
                return (cellValue == 1 || cellValue === '1' || cellValue === 'true' || cellValue === 'yes') && header === filter.key;
            });
            console.log(`Matching Column for ${filter.key}: ${matchingColumn}`);
            return matchingColumn !== -1;
        });
    });
    return filteredData;
}

export function setGlobalData(data) {
    globalData = data;
}