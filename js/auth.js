// js/auth.js
import { tokenClient } from './app.js';

export function handleAuth() {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                console.error('Authorization error:', resp.error);
                reject(new Error('Authorization error: ' + resp.error));
                return;
            }
            resolve(true);
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
}

export function handleSignout() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        return true;
    }
    return false;
}