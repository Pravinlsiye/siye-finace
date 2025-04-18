import { Project } from '../types/Project';

// Google Drive API configuration
const DRIVE_FOLDER_NAME = 'Financial Projects';
const DRIVE_MIME_TYPE = 'application/json';

// Initialize Google Drive API client
export const initDriveClient = async () => {
  try {
    // Check if gapi is loaded and initialized
    if (!window.gapi || !window.gapi.client) {
      throw new Error('Google API client not loaded');
    }

    await window.gapi.client.init({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: 'https://www.googleapis.com/auth/drive.file'
    });

    return window.gapi.client.drive;
  } catch (error) {
    console.error('Error initializing Drive client:', error);
    throw error;
  }
};

// Create or get the app folder in Drive
export const getAppFolder = async (driveClient: any): Promise<string> => {
  try {
    // Search for existing folder
    const response = await driveClient.files.list({
      q: `name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)'
    });

    if (response.result.files && response.result.files.length > 0) {
      return response.result.files[0].id;
    }

    // Create new folder if it doesn't exist
    const fileMetadata = {
      name: DRIVE_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await driveClient.files.create({
      resource: fileMetadata,
      fields: 'id'
    });

    return folder.result.id;
  } catch (error) {
    console.error('Error getting/creating app folder:', error);
    throw error;
  }
};

// Save project data to Drive
export const saveToDrive = async (project: Project): Promise<void> => {
  try {
    const driveClient = await initDriveClient();
    const folderId = await getAppFolder(driveClient);

    // Prepare file metadata and content
    const fileMetadata = {
      name: `${project.companyName}_${project.id}.json`,
      parents: [folderId],
      mimeType: DRIVE_MIME_TYPE
    };

    const fileContent = JSON.stringify(project, null, 2);

    // Check if file already exists
    const existingFile = await driveClient.files.list({
      q: `name='${fileMetadata.name}' and '${folderId}' in parents and trashed=false`,
      fields: 'files(id)'
    });

    if (existingFile.result.files && existingFile.result.files.length > 0) {
      // Update existing file
      await driveClient.files.update({
        fileId: existingFile.result.files[0].id,
        resource: fileMetadata,
        media: {
          mimeType: DRIVE_MIME_TYPE,
          body: fileContent
        }
      });
    } else {
      // Create new file
      await driveClient.files.create({
        resource: fileMetadata,
        media: {
          mimeType: DRIVE_MIME_TYPE,
          body: fileContent
        },
        fields: 'id'
      });
    }
  } catch (error) {
    console.error('Error saving to Drive:', error);
    throw error;
  }
};