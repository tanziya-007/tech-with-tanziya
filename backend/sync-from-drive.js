require('dotenv').config();
const mongoose = require('mongoose');
const { CheatSheet } = require('./models');
const { listSubFolders, listImagesInFolder } = require('./googleDrive');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected');

  // Remove all entries that have no googleDriveId
  const slugsToDelete = ['python', 'sql', 'html', 'css', 'javascript', 'git', 'linux', 'mysql'];
  const del = await CheatSheet.deleteMany({ slug: { $in: slugsToDelete } });
  console.log('Deleted orphaned entries:', del.deletedCount);

  // Sync from Drive subfolders
  const folders = await listSubFolders(process.env.GOOGLE_DRIVE_FOLDER_ID);
  console.log('Drive folders found:', folders.map(f => f.name));

  for (const folder of folders) {
    const slug = folder.name.toLowerCase().replace(/\s+/g, '-');
    const images = await listImagesInFolder(folder.id);
    if (!images.length) {
      console.log('No image in folder:', folder.name, '- skipping');
      continue;
    }
    const result = await CheatSheet.findOneAndUpdate(
      { slug },
      { slug, title: folder.name, googleDriveId: images[0].id, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    console.log('Synced:', result.slug, '->', result.googleDriveId);
  }

  const all = await CheatSheet.find({}, 'slug title googleDriveId');
  console.log('\nFinal DB state:');
  all.forEach(s => console.log(' -', s.slug, '|', s.title, '|', s.googleDriveId || 'NO DRIVE ID'));

  await mongoose.disconnect();
  console.log('\nDone!');
}

run().catch(console.error);
