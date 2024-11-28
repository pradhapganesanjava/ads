// js/gDriveService.js

import { GoogleDriveAPI } from './gDriveApi.js';
import { GDRIVE_GOODNOTES_ADS_PATH, GDRIVE_ANKI_ADS_PATH, GDRIVE_ANKI_PATTERN_PATH } from './const.js';

let globalDriveFiles = [];
let ankiLeetProbs = [];
let ankiLeetPatterns = {};

export function setGlobalDriveFiles(files) {
    globalDriveFiles = files;
}

export function setAnkiLeetProbs(files) {
    ankiLeetProbs = files;
}

export function setAnkiLeetPatterns(patterns) {
    ankiLeetPatterns = patterns;
}

export function listAnkiLeetProbById(problemId) {
    return ankiLeetProbs.find(problem => problem.note_id === problemId) || null;
}

export function listDriveFileById(noteId) {
    return globalDriveFiles.find(file => file.note_id === noteId) || null;
}

export function getAnkiLeetPatternByName(patternName) {
    return ankiLeetPatterns[patternName] || null;
}

async function getProcessedFiles(folderPath, processFunction) {
    try {
        const files = await listFilesByPath(folderPath);
        if (!files) {
            console.error('No files found in the folder:', folderPath);
            return [];
        }
        return processFunction(files);
    } catch (error) {
        console.error('Error getting processed files:', error);
        return [];
    }
}

function processGoodNotesAndAnkiFiles(files) {
    return files
        .map(file => {
            const match = file.name.match(/^(\d+)/);
            if (match) {
                const note_id = parseInt(match[1], 10);
                return { note_id, ...file };
            }
            return null;
        })
        .filter(file => file !== null);
}

function processAnkiLeetPatterns(files) {
    return files.reduce((acc, file) => {
        acc[file.name] = file;
        return acc;
    }, {});
}

export async function getGoodNotesADSFiles() {
    const processedFiles = await getProcessedFiles(GDRIVE_GOODNOTES_ADS_PATH, processGoodNotesAndAnkiFiles);
    setGlobalDriveFiles(processedFiles);
    return processedFiles;
}

export async function getAnkiLeetProbs() {
    const processedFiles = await getProcessedFiles(GDRIVE_ANKI_ADS_PATH, processGoodNotesAndAnkiFiles);
    setAnkiLeetProbs(processedFiles);
    return processedFiles;
}

export async function getAnkiLeetPatterns() {
    const processedPatterns = await getProcessedFiles(GDRIVE_ANKI_PATTERN_PATH, processAnkiLeetPatterns);
    setAnkiLeetPatterns(processedPatterns);
    return processedPatterns;
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