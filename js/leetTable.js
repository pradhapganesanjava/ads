// js/leetTable.js
import { FILTER_HEADERS } from './const.js';
import { getAnkiwebNoteById } from './sheetOperations.js';
import { getGoodNotesADSTagsFileByName, listDriveFileById, listAnkiLeetProbById, getAnkiLeetPatternByName } from './gDriveService.js';
import { eventBus } from './eventBus.js';

export function renderTable(filteredData) {
    const tableElement = document.getElementById('sheetDataTable');
    if (!tableElement) {
        console.error('Table element not found');
        return;
    }

    const tableHeaders = createTableHeaders();
    const tableData = createTableData(filteredData);

    renderDataTable(tableHeaders, tableData);
}

function createTableHeaders() {
    return FILTER_HEADERS.map(header => `<th>${header}</th>`).join('');
}

function createTableData(filteredData) {
    return filteredData.map(row => 
        FILTER_HEADERS.map(header => createCellContent(header, row))
    );
}

function createCellContent(header, row) {
    switch (header) {
        case 'title':
            return createTitleCell(row);
        case 'tags':
            return formatTags(row.tags);
        case 'relation_tag':
            return createRelationTags(row.relation_tag);
        default:
            return row[header] !== undefined ? row[header] : '';
    }
}

function createTitleCell(row) {
    const titleLink = createTitleLink(row);
    const noteIcon = createNoteIcon(row);
    const ankiIcon = createAnkiIcon(row);
    return `<div>${titleLink}</div><div>${noteIcon}</div><div>${ankiIcon}</div>`;
}

function createTitleLink(row) {
    return `<a href="${row.link}" target="_blank" rel="noopener noreferrer" 
        onclick="window.open(this.href, '_blank', 'width=1200,height=800'); return false;">
        ${row.title}
    </a>`;
}

function createNoteIcon(row) {
    const driveFile = listDriveFileById(row.ID);
    return driveFile ? 
        `<a href="#" class="note-icon" data-file-id="${driveFile.id}" data-title="${row.title}">
            <i class="far fa-file-alt"></i>
        </a>` : '';
}

function createAnkiIcon(row) {
    const ankiwebNote = getAnkiwebNoteById(row.ID);
    if (ankiwebNote) {
        return `<a href="#" class="anki-icon" data-file-id="${ankiwebNote.nid}" data-title="${row.ID}">
            <img src="img/anki-icon.svg" alt="Anki Icon" class="anki-icon-img">
        </a>`;
    }
    return '';
}

function createAnkiIconPdf(row) {
    const ankiProb = listAnkiLeetProbById(row.ID); //pdf exported; dont remove it.
    return ankiProb ?
        `<a href="#" class="anki-icon" data-file-id="${ankiProb.id}" data-title="${row.ID}">
            <img src="img/anki-icon.svg" alt="Anki Icon" class="anki-icon-img">
        </a>` : '';
}

function formatTagsXX(tags) {
    return Array.isArray(tags) ? tags.join(', ') : tags;
}

function formatTagsX(tags) {
    if (!Array.isArray(tags)) {
        tags = [tags];
    }
    return tags.map(tag => {
        const ankiwebNote = getAnkiwebNoteById(tag);
        if (ankiwebNote) {
            const borderColor = getColorForTag(tag);
            return `<a href="#" class="tag-link" data-file-id="${ankiwebNote.nid}" data-title="${tag}" 
                style="border: 2px solid ${borderColor}; border-radius: 3px; padding-left: 2px; display: inline-block; margin: 2px;">
                ${tag}
            </a>`;
        }
        return tag;
    }).join(', ');
}
function formatTags(tags) {
    if (!Array.isArray(tags)) {
        tags = [tags];
    }
    return tags.map(tag => {
        const ankiwebNote = getAnkiwebNoteById(tag);
        const goodNotesFile = getGoodNotesADSTagsFileByName(tag);
        
        if (!ankiwebNote && !goodNotesFile) {
            return tag;
        }
        
        const borderColor = getColorForTag(tag);
        let icons = '';
        
        if (ankiwebNote) {
            icons += `<a href="#" class="anki-icon" data-file-id="${ankiwebNote.nid}">
                <img src="img/anki-icon.svg" alt="Anki Icon" class="anki-icon-img">
            </a>`;
        }
        
        if (goodNotesFile) {
            icons += `<a href="#" class="note-icon" data-file-id="${goodNotesFile.id}">
                <i class="far fa-file-alt"></i>
            </a>`;
        }
        
        return `<span class="tag-container" style="border: 2px solid ${borderColor}; border-radius: 3px; padding: 2px; display: inline-block; margin: 2px;">
            ${tag} ${icons}
        </span>`;
    }).join(' ');
}

function createRelationTags(relationTags) {
    const tags = Array.isArray(relationTags) ? relationTags : [relationTags];
    return tags.map(createRelationTag).join(', ');
}

function createRelationTagX(tag) {
    const ankiwebNote = getAnkiwebNoteById(tag);
    if (ankiwebNote) {
        const borderColor = getColorForTag(tag);
        return `<a href="#" class="relation-tag" data-file-id="${ankiwebNote.nid}" data-title="${tag}" 
            style="border: 2px solid ${borderColor}; border-radius: 3px; padding-left: 2px; display: inline-block; margin: 2px;">
            ${tag}
        </a>`;
    }
    return tag;
}

function createRelationTag(tag) {
    const ankiwebNote = getAnkiwebNoteById(tag);
    const goodNotesFile = getGoodNotesADSTagsFileByName(tag);
    
    if (!ankiwebNote && !goodNotesFile) {
        return tag;
    }
    
    const borderColor = getColorForTag(tag);
    let icons = '';
    
    if (ankiwebNote) {
        icons += `<a href="#" class="anki-icon" data-file-id="${ankiwebNote.nid}">
            <img src="img/anki-icon.svg" alt="Anki Icon" class="anki-icon-img">
        </a>`;
    }
    
    if (goodNotesFile) {
        icons += `<a href="#" class="note-icon" data-file-id="${goodNotesFile.id}">
            <i class="far fa-file-alt"></i>
        </a>`;
    }
    
    return `<span class="tag-container" style="border: 2px solid ${borderColor}; border-radius: 3px; padding: 2px; display: inline-block; margin: 2px;">
        ${tag} ${icons}
    </span>`;
}

function createRelationTagFromPDF(tag) {
    const pattern = getAnkiLeetPatternByName(tag);
    if (pattern) {
        const borderColor = getColorForTag(tag);
        return `<a href="#" class="relation-tag" data-file-id="${pattern.id}" data-title="${tag}" 
            style="border: 2px solid ${borderColor}; border-radius: 3px; padding-left: 2px; display: inline-block; margin: 2px;">
            ${tag}
        </a>`;
    }
    return tag;
}

function renderDataTable(tableHeaders, tableData) {
    $('#sheetDataTable thead').html(`<tr>${tableHeaders}</tr>`);

    if ($.fn.DataTable.isDataTable('#sheetDataTable')) {
        $('#sheetDataTable').DataTable().destroy();
    }

    $('#sheetDataTable').DataTable({
        data: tableData,
        columns: createDataTableColumns(),
        pageLength: 25,
        lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
        responsive: true,
        scrollY: '100%',
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        autoWidth: false,
        dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        drawCallback: setupEventListeners
    });
}

function createDataTableColumns() {
    return FILTER_HEADERS.map((header) => ({
        title: header,
        render: (data, type) => (type === 'display' && header === 'title') ? data : data,
        createdCell: (td, cellData, rowData, row, col) => {
            if (header === 'title') $(td).addClass('title-cell');
        }
    }));
}

function setupEventListenersX() {
    $('.note-icon, .anki-icon, .relation-tag, .tag-link').off('click').on('click', function(e) {
        e.preventDefault();
        const fileId = $(this).data('file-id');
        const title = $(this).data('title');
        const eventType = $(this).attr('class').split('-')[0];
        const eventMap = {
            'note': 'showPdfViewer',
            'anki': 'showAnkiPopup',
            'relation': 'showRelationTagPopup',
            'tag': 'showTagPopup'
        };
        eventBus.publish(eventMap[eventType], { fileId, title });
    });
}
function setupEventListeners() {
    $('.note-icon, .anki-icon').off('click').on('click', function(e) {
        e.preventDefault();
        const fileId = $(this).data('file-id');
        const title = $(this).closest('.tag-container').text().trim();
        const eventType = $(this).hasClass('note-icon') ? 'showPdfViewer' : 'showAnkiPopup';
        eventBus.publish(eventType, { fileId, title });
    });
}

const colorCache = new Map();
const goldenRatio = 0.618033988749895;
let hue = Math.random();

function getColorForTag(tag) {
    if (colorCache.has(tag)) {
        return colorCache.get(tag);
    }

    hue += goldenRatio;
    hue %= 1;

    const hslColor = `hsl(${Math.floor(hue * 360)}, 100%, 50%)`;
    colorCache.set(tag, hslColor);

    return hslColor;
}