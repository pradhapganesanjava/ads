// js/jscript.js

let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
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

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.display = 'block';
    }
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

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error('OAuth Error:', resp.error);
            document.getElementById('tableContainer').innerText = 'Authorization error: ' + resp.error;
            return;
        }
        
        document.getElementById('signout_button').style.display = 'block';
        document.getElementById('authorize_button').innerText = 'Refresh';
        
        try {
            await loadSheetsData();
        } catch (error) {
            console.error('Error loading sheet data:', error);
            document.getElementById('tableContainer').innerText = 'Error loading data: ' + error.message;
        }
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}