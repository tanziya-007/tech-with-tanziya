require('dotenv').config();
const mongoose = require('mongoose');
const { CheatSheet } = require('./models');
const { listFilesFromFolder } = require('./googleDrive');

async function syncCheatSheets() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const files = await listFilesFromFolder(process.env.GOOGLE_DRIVE_FOLDER_ID);
  console.log(`📁 Found ${files.length} files in Drive folder`);

  for (const file of files) {
    // slug = filename without extension, lowercased (e.g. "Java.png" → "java")
    const slug = file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/\s+/g, '-');

    const updated = await CheatSheet.findOneAndUpdate(
      { slug },
      { googleDriveId: file.id, updatedAt: new Date() },
      { new: true }
    );

    if (updated) {
      console.log(`✅ Updated: ${slug} → ${file.id}`);
    } else {
      console.log(`⚠️  No cheatsheet found for slug: ${slug} (skipped)`);
    }
  }

  await mongoose.disconnect();
  console.log('\n🎉 Sync complete!');
}

syncCheatSheets().catch(console.error);
