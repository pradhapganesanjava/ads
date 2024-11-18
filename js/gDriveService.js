// js gDriveService.js

import { GoogleDriveAPI } from './gDriveApi.js';
import { GDRIVE_GOODNOTES_ADS_PATH } from './const.js';

let globalDriveFiles = [];

export function setGlobalDriveFiles(files) {
    globalDriveFiles = files;
}

export function listDriveFileById(noteId) {
    return globalDriveFiles.find(file => file.note_id === noteId) || null;
}
export async function getGoodNotesADSFiles() {
    try {
        // List files in the folder
        // const files = await GoogleDriveAPI.listFiles(GDRIVE_GOODNOTES_ADS_FID);
        const files = await listFilesByPath(GDRIVE_GOODNOTES_ADS_PATH);

        if (!files) {
            console.error('No files found in the folder:', GDRIVE_GOODNOTES_ADS_PATH);
            return [];
        }

        // Process the files
        const processedFiles = files
            .map(file => {
                // Check if the file name starts with an integer
                const match = file.name.match(/^(\d+)/);
                if (match) {
                    // Extract the prefix integer
                    const note_id = parseInt(match[1], 10);
                    // Return a new object with the id and original file data
                    return {
                        note_id,
                        ...file
                    };
                }
                // If the file name doesn't start with an integer, return null
                return null;
            })
            .filter(file => file !== null); // Remove null entries

        console.log('Processed files:', processedFiles);

        // set the global drive files
        setGlobalDriveFiles(processedFiles);

        // Return the processed files
        return processedFiles;
    } catch (error) {
        console.error('Error getting nested folder files:', error);
        // Handle the error appropriately
        // throw error; // or return an error JSON response
    }
    return [];
}

export async function fetchPdfFromDrive(fileId) {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });

        const pdfBlob = new Blob([response.body], { type: 'application/pdf' });
        return pdfBlob;
    } catch (error) {
        console.error('Error fetching PDF from Drive:', error);
        throw error;
    }
}

export async function listFilesByPath(folderPath) {
    try {
        // Get the folder ID
        const specificFolderId = await GoogleDriveAPI.getFolderIdByPath(folderPath);

        // List files in the folder
        const files = await GoogleDriveAPI.listFiles(specificFolderId);

        console.log('Files in the nested folder:', files);
        
        return files;
    } catch (error) {
        console.error('Error getting nested folder files:', error);
    }
    return [];
}