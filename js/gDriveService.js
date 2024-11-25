// js/gDriveService.js

import { GoogleDriveAPI } from './gDriveApi.js';
import { GDRIVE_GOODNOTES_ADS_PATH, GDRIVE_ANKI_ADS_PATH } from './const.js';

let globalDriveFiles = [];
let ankiLeetProbs = [];

export function setGlobalDriveFiles(files) {
    globalDriveFiles = files;
}

export function setAnkiLeetProbs(files) {
    ankiLeetProbs = files;
}

export function listAnkiLeetProbById(problemId) {
    return ankiLeetProbs.find(problem => problem.note_id === problemId) || null;
}

export function listDriveFileById(noteId) {
    return globalDriveFiles.find(file => file.note_id === noteId) || null;
}

async function getProcessedFiles(folderPath) {
    try {
        const files = await listFilesByPath(folderPath);

        if (!files) {
            console.error('No files found in the folder:', folderPath);
            return [];
        }

        const processedFiles = files
            .map(file => {
                const match = file.name.match(/^(\d+)/);
                if (match) {
                    const note_id = parseInt(match[1], 10);
                    return { note_id, ...file };
                }
                return null;
            })
            .filter(file => file !== null);

        console.log('Processed files:', processedFiles);
        return processedFiles;
    } catch (error) {
        console.error('Error getting processed files:', error);
        return [];
    }
}

export async function getGoodNotesADSFiles() {
    const processedFiles = await getProcessedFiles(GDRIVE_GOODNOTES_ADS_PATH);
    setGlobalDriveFiles(processedFiles);
    return processedFiles;
}

export async function getAnkiLeetProbs() {
    const processedFiles = await getProcessedFiles(GDRIVE_ANKI_ADS_PATH);
    setAnkiLeetProbs(processedFiles);
    return processedFiles;
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
        const specificFolderId = await GoogleDriveAPI.getFolderIdByPath(folderPath);
        const files = await GoogleDriveAPI.listFiles(specificFolderId);
        console.log('Files in the nested folder:', files);
        return files;
    } catch (error) {
        console.error('Error getting nested folder files:', error);
    }
    return [];
}