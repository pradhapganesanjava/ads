// js gDriveService.js

import { GoogleDriveAPI } from './gDriveApi.js';
import { GDRIVE_GOODNOTES_ADS_FID } from './const.js';

export async function getGoodNotesADSFiles() {
    try {
        // List files in the folder
        const files = await GoogleDriveAPI.listFiles(GDRIVE_GOODNOTES_ADS_FID);

        console.log('Files in the nested folder:', files);
        // You can add logic here to display the files in your UI
    } catch (error) {
        console.error('Error getting nested folder files:', error);
        // Handle the error appropriately
    }
}

export async function getFiles(folderPath) {
    try {
        // Get the folder ID
        const specificFolderId = await GoogleDriveAPI.getFolderIdByPath(folderPath);

        // List files in the folder
        const files = await GoogleDriveAPI.listFiles(specificFolderId);

        console.log('Files in the nested folder:', files);
        // You can add logic here to display the files in your UI
    } catch (error) {
        console.error('Error getting nested folder files:', error);
        // Handle the error appropriately
    }
}