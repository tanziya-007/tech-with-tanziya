const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH),
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

const drive = google.drive({ version: 'v3', auth });

async function listFilesFromFolder(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });
  return res.data.files || [];
}

async function listSubFolders(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });
  return res.data.files || [];
}

async function listImagesInFolder(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false and (mimeType contains 'image/')`,
    fields: 'files(id, name, mimeType)',
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });
  return res.data.files || [];
}

async function listImagesInFolderRecursive(folderId) {
  const images = await listImagesInFolder(folderId);
  const subfolders = await listSubFolders(folderId);
  for (const subfolder of subfolders) {
    const nestedImages = await listImagesInFolderRecursive(subfolder.id);
    images.push(...nestedImages);
  }
  return images;
}

module.exports = { listFilesFromFolder, listSubFolders, listImagesInFolder, listImagesInFolderRecursive };
