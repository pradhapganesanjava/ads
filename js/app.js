// js/app.js
import { CLIENT_ID, API_KEY, DISCOVERY_DOC, SCOPES } from './const.js';
import { loadGoogleApis, initializeGapiClient, initializeGisClient } from './googleApi.js';
import { handleAuthClick, handleSignoutClick } from './auth.js';

let tokenClient;

export async function initializeApp() {
    await loadGoogleApis();
    await initializeGapiClient(API_KEY, DISCOVERY_DOC);
    tokenClient = await initializeGisClient(CLIENT_ID, SCOPES);

    document.getElementById('authorize_button').style.display = 'block';
    document.getElementById('authorize_button').onclick = handleAuthClick;
    document.getElementById('signout_button').onclick = handleSignoutClick;
}

export { tokenClient };