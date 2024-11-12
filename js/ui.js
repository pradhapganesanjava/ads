// ui.js
import { state, subscribe } from './state.js';

export function initUI() {
    updateUI(state);
    subscribe(updateUI);
}

function updateUI(state) {
    const authorizeButton = document.getElementById('authorize_button');
    const signoutButton = document.getElementById('signout_button');

    if (state.isAuthorized) {
        authorizeButton.innerText = 'Refresh';
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'block';
    } else {
        authorizeButton.innerText = 'Authorize';
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}