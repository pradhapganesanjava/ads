// js/gDriveService.js

import { GoogleDriveAPI } from './gDriveApi.js';
import { GDRIVE_GOODNOTES_ADS_PATH, GDRIVE_GOODNOTES_ADS_TAGS_PATH, GDRIVE_ANKI_ADS_PATH, GDRIVE_ANKI_PATTERN_PATH } from './const.js';

let globalDriveFiles = [];
let goodNotesADSTagsFiles = [];
let ankiLeetProbs = [];
let ankiLeetPatterns = {};

export function setGoodNotesADSTagsFiles(files) {
    const fileCount = Array.isArray(files) ? files.length : 0;
    console.log(`setGoodNotesADSTagsFiles: ${fileCount} files`);
    goodNotesADSTagsFiles = files || [];
}

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

export function getGoodNotesADSTagsFileByName(patternName) {
    if (!patternName || typeof patternName !== 'string') {
        return null;
    }

    if (goodNotesADSTagsFiles[patternName]) {
        return goodNotesADSTagsFiles[patternName];
    }

    const lowerPatternName = patternName.toLowerCase();
    for (const key in goodNotesADSTagsFiles) {
        if (key.toLowerCase() === lowerPatternName) {
            return goodNotesADSTagsFiles[key];
        }
    }

    return null;
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
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        acc[nameWithoutExtension] = file;
        return acc;
    }, {});
}

function parseGoodNotesADSTagsFiles(files) {
    return files.reduce((acc, file) => {
        const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        acc[nameWithoutExtension] = file;
        return acc;
    }, {});
}

export async function getGoodNotesADSTagsFiles() {
    const processedFiles = await getProcessedFiles(GDRIVE_GOODNOTES_ADS_TAGS_PATH, parseGoodNotesADSTagsFiles);
    console.log('getGoodNotesADSTagsFiles got processedFiles')
    setGoodNotesADSTagsFiles(processedFiles);
    console.log('getGoodNotesADSTagsFiles return processedFiles')
    return processedFiles;
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
        // console.log('Files in the nested folder:', files);
        return files;
    } catch (error) {
        console.error('Error getting nested folder files:', error);
    }
    return [];
}

export async function getFileIdFromPath(filePath) {
    try {
        const response = await gapi.client.drive.files.list({
            q: `name = '${filePath.split('/').pop()}' and mimeType = 'application/vnd.google-apps.spreadsheet'`,
            fields: 'files(id, name, parents)',
            spaces: 'drive'
        });

        const files = response.result.files;
        if (files && files.length > 0) {
            // You might want to add more logic here to ensure you're getting the correct file
            // if there are multiple files with the same name
            return files[0].id;
        } else {
            throw new Error('No files found.');
        }
    } catch (err) {
        console.error('Error getting file ID:', err);
        throw err;
    }
}