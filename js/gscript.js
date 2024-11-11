// js/gscript.js

import { CLIENT_ID, DISCOVERY_DOC, SCOPES, REDIRECT_URI } from './const.js';

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Attach to the window object to make it globally accessible
window.gapiLoaded = function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

// Attach to the window object to make it globally accessible
window.gisLoaded = function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI,
        callback: '',
    });
    gisInited = true;
    maybeEnableButtons();
}

async function initializeGapiClient() {
    await gapi.client.init({
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.display = 'block';
    }
}

async function authorizeUser() {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.error('OAuth Error:', resp.error);
                reject('Authorization error: ' + resp.error);
                return;
            }

            document.getElementById('signout_button').style.display = 'block';
            document.getElementById('authorize_button').innerText = 'Refresh';
            resolve('Authorization successful');
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('sheetDataTable').style.display = 'none';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.display = 'none';
    }
}

export { authorizeUser, handleSignoutClick };
