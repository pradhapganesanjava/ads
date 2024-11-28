// js/leetTable.js
import { FILTER_HEADERS } from './const.js';
import { listDriveFileById, listAnkiLeetProbById, getAnkiLeetPatternByName } from './gDriveService.js';
import { eventBus } from './eventBus.js';

export function renderTable(filteredData) {
    const tableElement = document.getElementById('sheetDataTable');
    if (!tableElement) {
        console.error('Table element not found');
        return;
    }

    const tableHeaders = FILTER_HEADERS.map(header => `<th>${header}</th>`).join('');
    $('#sheetDataTable thead').html(`<tr>${tableHeaders}</tr>`);

    const tableData = filteredData.map(row => {
        return FILTER_HEADERS.map(header => {
            if (header === 'title') {
                const driveFile = listDriveFileById(row.ID);
                const ankiProb = listAnkiLeetProbById(row.ID);
            
                const titleLink = `<a href="${row.link}" target="_blank" rel="noopener noreferrer" onclick="window.open(this.href, '_blank', 'width=1200,height=800'); return false;">${row.title}</a>`;
            
                const noteIcon = driveFile ?
                    `<a href="#" class="note-icon" data-file-id="${driveFile.id}" data-title="${row.title}">
                        <i class="far fa-file-alt"></i>
                    </a>` : '';
            
                const ankiIcon = ankiProb ?
                    `<a href="#" class="anki-icon" data-file-id="${ankiProb.id}" data-title="${row.title}">
                        <img src="img/anki-icon.svg" alt="Anki Icon" class="anki-icon-img">
                    </a>` : '';
            
                return `<div>${titleLink}</div><div>${noteIcon}</div><div>${ankiIcon}</div>`;
            } else if (header === 'tags') {
                return Array.isArray(row.tags) ? row.tags.join(', ') : row.tags;
            } else if (header === 'relation_tag') {
                const tags = Array.isArray(row.relation_tag) ? row.relation_tag : [row.relation_tag];
                return tags.map(tag => {
                    const pattern = getAnkiLeetPatternByName(tag);
                    if (pattern) {
                        const backgroundColor = getColorForTag(tag);
                        return `<a href="#" class="relation-tag" data-file-id="${pattern.id}" data-title="${tag}" style="background-color: ${backgroundColor};">${tag}</a>`;
                    }
                    return tag;
                }).join(', ');
            }
            return row[header] !== undefined ? row[header] : '';
        });
    });

    if ($.fn.DataTable.isDataTable('#sheetDataTable')) {
        $('#sheetDataTable').DataTable().destroy();
    }

    $('#sheetDataTable').DataTable({
        data: tableData,
        columns: FILTER_HEADERS.map((header, index) => ({
            title: header,
            render: function (data, type, row) {
                if (type === 'display' && header === 'title') {
                    return data;
                }
                return data;
            },
            createdCell: function (td, cellData, rowData, row, col) {
                if (header === 'title') {
                    $(td).addClass('title-cell');
                }
            }
        })),
        pageLength: 25,
        lengthMenu: [[25, 50, 100, -1], [25, 50, 100, "All"]],
        responsive: true,
        scrollY: '100%',
        scrollX: true,
        scrollCollapse: true,
        paging: true,
        autoWidth: false,
        dom: '<"row"<"col-sm-12 col-md-6"B><"col-sm-12 col-md-6"f>>rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        drawCallback: function () {
            $('.note-icon').on('click', function (e) {
                e.preventDefault();
                const fileId = $(this).data('file-id');
                const title = $(this).data('title');
                eventBus.publish('showPdfViewer', { fileId, title });
            });

            $('.anki-icon').on('click', function (e) {
                e.preventDefault();
                const fileId = $(this).data('file-id');
                const title = $(this).data('title');
                eventBus.publish('showAnkiPopup', { fileId, title });
            });

            $('.relation-tag').on('click', function (e) {
                e.preventDefault();
                const fileId = $(this).data('file-id');
                const title = $(this).data('title');
                eventBus.publish('showRelationTagPopup', { fileId, title });
            });
        }
    });
}

function getColorForTag(tag) {
    // Implement a function to generate a unique color for each tag
    // This is a simple example using hash function
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 80%)`;
    return color;
}