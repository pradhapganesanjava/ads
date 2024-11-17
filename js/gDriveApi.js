// js/gDriveApi.js

export const GoogleDriveAPI = {
    async listFiles(folderId = 'root') {
        try {
            const allFiles = [];
            let pageToken = null;
            do {
                const response = await gapi.client.drive.files.list({
                    'pageSize': 1000,
                    'fields': 'nextPageToken, files(id, name, webViewLink, webContentLink, mimeType)',
                    'q': `'${folderId}' in parents`,
                    'pageToken': pageToken,
                });

                const files = response.result.files;
                files.forEach(file => {
                    let previewLink = file.webContentLink;

                    // For Google Docs, Sheets, Slides
                    if (file.mimeType.includes('application/vnd.google-apps.')) {
                        previewLink = `https://drive.google.com/file/d/${file.id}/preview`;
                    }

                    allFiles.push({
                        id: file.id,
                        name: file.name,
                        webViewLink: file.webViewLink,
                        previewLink: previewLink,
                        mimeType: file.mimeType
                    });
                });

                pageToken = response.result.nextPageToken;
            } while (pageToken);

            return allFiles;
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    },

    async getFolderIdByPath(path) {
        const folders = path.split('/').filter(folder => folder !== '');
        let currentFolderId = 'root';

        for (const folderName of folders) {
            currentFolderId = await this.findFolderInParent(currentFolderId, folderName);
            if (!currentFolderId) {
                throw new Error(`Folder not found: ${folderName}`);
            }
        }

        return currentFolderId;
    },

    async findFolderInParent(parentId, folderName) {
        try {
            const response = await gapi.client.drive.files.list({
                q: `'${parentId}' in parents and name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder'`,
                fields: 'files(id, name)',
                spaces: 'drive'
            });

            if (response.result.files.length > 0) {
                return response.result.files[0].id;
            }
            return null;
        } catch (err) {
            console.error('Error in findFolderInParent:', err);
            throw err;
        }
    }
};
