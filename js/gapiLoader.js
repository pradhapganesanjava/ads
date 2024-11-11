// js/gapiLoader.js

import { CLIENT_ID, SCOPES, REDIRECT_URI } from './const.js';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        callback: '',
    });
    gisInited = true;
    maybeEnableButtons();
}

// Expose the functions globally
window.gapiLoaded = gapiLoaded;
window.gisLoaded = gisLoaded;
