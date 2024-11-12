// error.js

export function handleError(error) {
    console.error('Error:', error);
    document.getElementById('content').textContent = 'Error: ' + error.message;
}