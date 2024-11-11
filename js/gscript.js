// js/gscript.js

import { CLIENT_ID, DISCOVERY_DOC, SCOPES, REDIRECT_URI } from './const.js';

export let tokenClient;
export let gapiInited = false;
export let gisInited = false;

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

export { initializeGapiClient, authorizeUser };
