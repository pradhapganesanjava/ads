// pdfViewer.js
import { eventBus } from './eventBus.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function (page) {
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.getElementById('pdfViewer');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.getElementById('pageInfo').textContent = `Page ${num} of ${pdfDoc.numPages}`;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function onZoomIn() {
    scale *= 1.2;
    renderPage(pageNum);
}

function onZoomOut() {
    scale /= 1.2;
    renderPage(pageNum);
}

export function renderPDF(pdfUrl) {
    pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
        pdfDoc = pdf;
        renderPage(pageNum);
    });

    document.getElementById('prevPage').addEventListener('click', onPrevPage);
    document.getElementById('nextPage').addEventListener('click', onNextPage);
    document.getElementById('zoomIn').addEventListener('click', onZoomIn);
    document.getElementById('zoomOut').addEventListener('click', onZoomOut);
}

export function closePdfViewer() {
    const pdfViewerContainer = document.getElementById('pdfViewerContainer');
    const tableContainer = document.getElementById('tableContainer');

    pdfViewerContainer.classList.add('d-none');
    tableContainer.classList.remove('d-none');

    // Reset PDF viewer state
    pdfDoc = null;
    pageNum = 1;
    scale = 1.5;

    // Clear the canvas
    const canvas = document.getElementById('pdfViewer');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    eventBus.publish('showTable');
}