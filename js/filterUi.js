// js/filterUi.js

export function renderFilters(filterData) {
    if (!filterData || filterData.length < 2) {
        console.error('Invalid filter data');
        return;
    }

    const [headers, ...data] = filterData;
    const categoryIndex = headers.indexOf('CATEGORY');
    const nameIndex = headers.indexOf('NAME');

    if (categoryIndex === -1 || nameIndex === -1) {
        console.error('Required columns not found in filter data');
        return;
    }

    const categories = {};
    data.forEach(row => {
        const category = row[categoryIndex];
        const name = row[nameIndex];
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(name);
    });

    const filterSection = document.querySelector('.filter-section');
    filterSection.innerHTML = ''; // Clear existing content

    Object.entries(categories).forEach(([category, items]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'filter-category mb-3';
        categoryDiv.innerHTML = `<h5>${category}</h5>`;

        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'd-flex flex-wrap';

        items.forEach(item => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary btn-sm m-1 filter-item';
            button.textContent = item;
            button.dataset.category = category;
            button.dataset.item = item;
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
        item: button.dataset.item
    }));
    console.log('Active filters:', activeFilters);
    // You can emit an event or call a function here to update the main table based on the active filters
}