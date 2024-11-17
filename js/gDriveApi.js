// js/gDriveApi.js

export const GoogleDriveAPI = {
    async listFiles(folderId = 'root') {
        try {
            const response = await gapi.client.drive.files.list({
                'pageSize': 10,
                'fields': 'files(id, name, webViewLink)',
                'q': `'${folderId}' in parents`
            });
            return response.result.files;
        } catch (err) {
            console.error('Error in listFiles:', err);
            throw err;
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
