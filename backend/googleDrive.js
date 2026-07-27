require("dotenv").config();

const { google } = require("googleapis");

/**
 * Create Google Auth
 * Supports:
 * 1. Render → GOOGLE_SERVICE_ACCOUNT_KEY
 * 2. Local → GOOGLE_SERVICE_ACCOUNT_KEY_PATH
 */
function createAuth() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly"
      ]
    });
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
    return new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly"
      ]
    });
  }

  throw new Error(
    "Either GOOGLE_SERVICE_ACCOUNT_KEY or GOOGLE_SERVICE_ACCOUNT_KEY_PATH must be set."
  );
}

const auth = createAuth();

const drive = google.drive({
  version: "v3",
  auth
});

/**
 * List all files in a folder
 */
async function listFilesFromFolder(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id,name,mimeType)",
    orderBy: "name",
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });

  return res.data.files || [];
}

/**
 * List only subfolders
 */
async function listSubFolders(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id,name)",
    orderBy: "name",
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });

  return res.data.files || [];
}

/**
 * List images inside one folder
 */
async function listImagesInFolder(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
    fields: "files(id,name,mimeType)",
    orderBy: "name",
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true
  });

  return res.data.files || [];
}

/**
 * Recursively list images
 */
async function listImagesInFolderRecursive(folderId) {
  const images = await listImagesInFolder(folderId);
  const subfolders = await listSubFolders(folderId);

  for (const folder of subfolders) {
    const nested = await listImagesInFolderRecursive(folder.id);
    images.push(...nested);
  }

  return images;
}

module.exports = {
  drive,
  auth,
  listFilesFromFolder,
  listSubFolders,
  listImagesInFolder,
  listImagesInFolderRecursive
};