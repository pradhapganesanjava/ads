// ui.js
import { state, subscribe } from './state.js';

export function initUI() {
    updateUI(state);
    subscribe(updateUI);
}

function updateUI(state) {
    const authorizeButton = document.getElementById('authorize_button');
    const signoutButton = document.getElementById('signout_button');

    authorizeButton.style.display = state.isAuthorized ? 'none' : 'block';
    signoutButton.style.display = state.isAuthorized ? 'block' : 'none';
    authorizeButton.innerText = state.isAuthorized ? 'Refresh' : 'Authorize';

    // Update other UI elements based on state
}