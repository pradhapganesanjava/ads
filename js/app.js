// js/app.js

import { loadGoogleApis, initializeGapiClient, initializeGisClient } from './googleApi.js';

let tokenClient;

export async function initializeApp(CONFIG) {
    try {
        await loadGoogleApis();
        await initializeGapiClient(CONFIG.API_KEY, CONFIG.DISCOVERY_DOC);
        tokenClient = await initializeGisClient(CONFIG.CLIENT_ID, CONFIG.SCOPES);
        return tokenClient;
    } catch (error) {
        console.error('Error initializing app:', error);
        throw error;
    }
}

export function getTokenClient() {
    if (!tokenClient) {
        throw new Error('Token client not initialized. Call initializeApp first.');
    }
    return tokenClient;
}