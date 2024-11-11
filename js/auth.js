// js/auth.js
import { tokenClient } from './app.js';
import { listMajors } from './sheetOperations.js';

export function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            console.error('Authorization error:', resp.error);
            updateContent('Authorization error: ' + resp.error);
            return;
        }
        document.getElementById('signout_button').style.display = 'block';
        document.getElementById('authorize_button').innerText = 'Refresh';
        try {
            await listMajors();
        } catch (error) {
            console.error('Error in listMajors:', error);
            updateContent('Error: ' + error.message);
        }
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

export function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        updateContent('');
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.display = 'none';
    }
}

function updateContent(text) {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        contentElement.innerText = text;
    } else {
        console.warn('Element with id "content" not found. Content:', text);
    }
}