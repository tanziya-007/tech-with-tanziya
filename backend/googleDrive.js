const { google } = require('googleapis');
const { CheatSheet, Blog, Project, Resource, Roadmap } = require('./models');

const drive = google.drive('v3');

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

async function getAuthClient() {
  return await auth.getClient();
}

async function listFilesFromDrive(folderId) {
  try {
    const authClient = await getAuthClient();
    const response = await drive.files.list({
      auth: authClient,
      q: `'${folderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name, mimeType, webViewLink)',
      pageSize: 100
    });
    return response.data.files || [];
  } catch (error) {
    console.error('Error listing files from Google Drive:', error);
    return [];
  }
}

async function syncCheatSheetsFromDrive() {
  const files = await listFilesFromDrive(process.env.GOOGLE_DRIVE_FOLDER_ID);
  
  for (const file of files) {
    if (file.name.endsWith('.md')) {
      const slug = file.name.replace('.md', '').toLowerCase().replace(/\s+/g, '-');
      
      await CheatSheet.findOneAndUpdate(
        { slug },
        {
          slug,
          title: file.name.replace('.md', ''),
          googleDriveId: file.id,
          updatedAt: new Date()
        },
        { upsert: true }
      );
    }
  }
  
  console.log('Cheat sheets synced from Google Drive');
}

module.exports = {
  listFilesFromDrive,
  syncCheatSheetsFromDrive
};
