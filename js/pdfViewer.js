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
    // Show loading indicator
    showLoading();

    pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
        pdfDoc = pdf;
        renderPage(pageNum);
        hideLoading();
    }).catch(function (error) {
        console.error('Error loading PDF:', error);
        hideLoading();
        eventBus.publish('showFallback');
    });

    document.getElementById('prevPage').addEventListener('click', onPrevPage);
    document.getElementById('nextPage').addEventListener('click', onNextPage);
    document.getElementById('zoomIn').addEventListener('click', onZoomIn);
    document.getElementById('zoomOut').addEventListener('click', onZoomOut);
}

function showLoading() {
    // Show a loading spinner or message
    const loadingElement = document.getElementById('pdfLoading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

function hideLoading() {
    // Hide the loading spinner or message
    const loadingElement = document.getElementById('pdfLoading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function showFallback(fileId) {
    const fallbackContainer = document.getElementById('fallbackContainer');
    const fallbackLink = document.getElementById('fallbackLink');
    const pdfViewerContainer = document.getElementById('pdfViewerContainer');

    if (fallbackContainer && fallbackLink && pdfViewerContainer) {
        pdfViewerContainer.style.display = 'none';
        fallbackContainer.style.display = 'block';
        fallbackLink.href = `https://drive.google.com/file/d/${fileId}/view`;
    }

    console.error('Failed to load PDF, showing fallback');
}

export function closePdfViewer() {
    $('#pdfViewerModal').modal('hide');

    // Reset PDF viewer state
    pdfDoc = null;
    pageNum = 1;
    scale = 1.5;

    // Clear the canvas
    const canvas = document.getElementById('pdfViewer');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}