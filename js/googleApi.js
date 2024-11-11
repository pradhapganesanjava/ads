// js/googleApi.js
export function loadGoogleApis() {
    return new Promise((resolve) => {
        if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
            resolve();
        } else {
            const interval = setInterval(() => {
                if (typeof gapi !== 'undefined' && typeof google !== 'undefined') {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        }
    });
}

export async function initializeGapiClient(apiKey, discoveryDoc) {
    await new Promise((resolve) => gapi.load('client', resolve));
    await gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: [discoveryDoc],
    });
}

export function initializeGisClient(clientId, scopes) {
    return google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: '', // defined later
    });
}