require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const { CheatSheet, Blog, Project, Resource, Roadmap, User } = require('./models');
const { listFilesFromFolder, listSubFolders, listImagesInFolder, listImagesInFolderRecursive } = require('./googleDrive');
const sendOTP = require('./mailService');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const otpStore = new Map();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

function getOtpRecord(username) {
  const record = otpStore.get(username);
  if (!record) return null;
  if (record.expiresAt <= Date.now()) {
    otpStore.delete(username);
    return null;
  }
  return record;
}

// CORS: allow a comma-separated list via CORS_ORIGIN, e.g.
// CORS_ORIGIN="http://localhost:3000,https://tech-with-tanziya-rg1z.vercel.app"
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow non-browser (server-to-server) requests when origin is undefined
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// ================================
// MongoDB Connection
// ================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

// ================================
// Auth Middleware
// ================================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired, please log in again' });
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ================================
// Health Check
// ================================
app.get('/api', (req, res) => {
  res.json({
    status: 'OK',
    message: 'TechWithTanziya backend API is running',
    endpoints: ['/api/health']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ================================
// Admin OTP Login
// ================================
app.post('/api/admin/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail !== normalizeEmail(ADMIN_EMAIL)) {
      return res.status(401).json({ error: 'Invalid admin account' });
    }

    if (!ADMIN_EMAIL) {
      return res.status(500).json({ error: 'Admin email is not configured' });
    }

    const otp = generateOtp();
    otpStore.set(normalizedEmail, {
      hash: hashOtp(otp),
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0
    });

    await sendOTP(ADMIN_EMAIL, otp);

    return res.json({
      message: 'OTP sent to the admin email address',
      expiresIn: OTP_TTL_MS / 1000
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const normalizedEmail = normalizeEmail(email);
    if (normalizedEmail !== normalizeEmail(ADMIN_EMAIL)) {
      return res.status(401).json({ error: 'Invalid admin account' });
    }

    const record = getOtpRecord(normalizedEmail);
    if (!record) {
      return res.status(401).json({ error: 'OTP expired or not requested' });
    }

    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      otpStore.delete(normalizedEmail);
      return res.status(429).json({ error: 'Too many invalid OTP attempts' });
    }

    if (record.hash !== hashOtp(otp.trim())) {
      record.attempts += 1;
      if (record.attempts >= OTP_MAX_ATTEMPTS) {
        otpStore.delete(normalizedEmail);
      }
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    otpStore.delete(normalizedEmail);
    const user = await User.findOne({ username: ADMIN_USERNAME });
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin account' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Drive - Subfolders
// ================================
app.get('/api/drive/folders', async (req, res) => {
  try {
    const folders = await listSubFolders(process.env.GOOGLE_DRIVE_FOLDER_ID);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Drive - Images in a folder
// ================================
app.get('/api/drive/folders/:folderId/images', async (req, res) => {
  try {
    const images = await listImagesInFolderRecursive(req.params.folderId);
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const result = images.map(f => ({
      id: f.id,
      name: f.name,
      thumbnailUrl: `${backendUrl}/api/drive/image/${f.id}`
    }));
    res.json(result);
  } catch (error) {
    console.error('Drive folder images error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Drive - Proxy image by file ID
// ================================
app.get('/api/drive/image/:fileId', async (req, res) => {
  try {
    const { google } = require('googleapis');
    const path = require('path');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(__dirname, process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH),
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });
    const drive = google.drive({ version: 'v3', auth });
    const driveRes = await drive.files.get(
      { fileId: req.params.fileId, alt: 'media' },
      { responseType: 'stream' }
    );
    res.setHeader('Content-Type', driveRes.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    driveRes.data.pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Sync Drive → DB (public, auto-syncs cheat sheets from Drive subfolders)
// ================================
app.post('/api/sync-drive', async (req, res) => {
  try {
    const folders = await listSubFolders(process.env.GOOGLE_DRIVE_FOLDER_ID);
    const synced = [];
    for (const folder of folders) {
      const slug = folder.name.toLowerCase().replace(/\s+/g, '-');
      const images = await listImagesInFolder(folder.id);
      if (!images.length) continue;
      await CheatSheet.findOneAndUpdate(
        { slug },
        {
          slug,
          title: folder.name,
          googleDriveFolderId: folder.id,
          googleDriveId: images[0]?.id,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
      synced.push(slug);
    }
    // Remove DB entries whose slug no longer matches any Drive folder
    const driveSlugs = folders.map(f => f.name.toLowerCase().replace(/\s+/g, '-'));
    await CheatSheet.deleteMany({ slug: { $nin: driveSlugs } });
    res.json({ synced });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Cheat Sheets
// ================================
app.get('/api/cheatsheets', async (req, res) => {
  try {
    const sheets = await CheatSheet.find().select('-content');
    res.json(sheets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cheatsheets/:slug', async (req, res) => {
  try {
    const sheet = await CheatSheet.findOne({ slug: req.params.slug });
    if (!sheet) return res.status(404).json({ error: 'Not found' });
    res.json(sheet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cheatsheets/:slug/drive', async (req, res) => {
  try {
    const sheet = await CheatSheet.findOne({ slug: req.params.slug }).select('googleDriveId googleDriveFolderId title');
    if (!sheet) return res.status(404).json({ error: 'No drive link found' });

    if (sheet.googleDriveFolderId) {
      const files = await listImagesInFolderRecursive(sheet.googleDriveFolderId);
      const items = files.map(f => ({
        id: f.id,
        name: f.name,
        previewUrl: `https://drive.google.com/file/d/${f.id}/preview`,
        downloadUrl: `https://drive.google.com/uc?export=download&id=${f.id}`
      }));
      return res.json({ images: items });
    }

    if (!sheet.googleDriveId) return res.status(404).json({ error: 'No drive link found' });
    const id = sheet.googleDriveId;
    res.json({
      images: [
        {
          id,
          name: sheet.title,
          previewUrl: `https://drive.google.com/file/d/${id}/preview`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cheatsheets', authMiddleware, async (req, res) => {
  try {
    const { slug, title, description, category, googleDriveId, googleDriveFolderId, topics, highlights, interviews } = req.body;
    if (!slug || !title || !googleDriveId)
      return res.status(400).json({ error: 'slug, title and googleDriveId are required' });
    const sheet = await CheatSheet.findOneAndUpdate(
      { slug },
      {
        slug,
        title,
        description,
        category,
        googleDriveId,
        googleDriveFolderId,
        topics,
        highlights,
        interviews,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    res.json(sheet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Blogs
// ================================
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 }).select('-content');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blogs', authMiddleware, async (req, res) => {
  try {
    const { slug, title, description, category, date, content } = req.body;
    if (!slug || !title || !content)
      return res.status(400).json({ error: 'slug, title and content are required' });
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { slug, title, description, category, date: date || new Date(), content, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/blogs/:slug', authMiddleware, async (req, res) => {
  try {
    await Blog.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Projects
// ================================
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().select('-content');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    let { slug, title, description, tech, github, demo, googleDriveFolderId } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
    if (googleDriveFolderId) {
      const match = googleDriveFolderId.match(/folders\/([a-zA-Z0-9_-]+)/);
      if (match) googleDriveFolderId = match[1];
    }
    const project = await Project.findOneAndUpdate(
      { slug },
      { slug, title, description, tech, github, demo, googleDriveFolderId, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:slug', authMiddleware, async (req, res) => {
  try {
    await Project.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Resources
// ================================
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resources/:slug', async (req, res) => {
  try {
    const resource = await Resource.findOne({ slug: req.params.slug });
    if (!resource) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resources', authMiddleware, async (req, res) => {
  try {
    let { slug, title, description, tag, link, googleDriveId } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
    if (googleDriveId) {
      const match = googleDriveId.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) googleDriveId = match[1];
    }
    const resource = await Resource.findOneAndUpdate(
      { slug },
      { slug, title, description, tag, link, googleDriveId, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/resources/:slug', authMiddleware, async (req, res) => {
  try {
    await Resource.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Roadmaps
// ================================
app.get('/api/roadmaps', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/roadmaps', authMiddleware, async (req, res) => {
  try {
    let { slug, title, description, googleDriveFolderId, googleDrivePdfId } = req.body;
    if (!slug || !title) return res.status(400).json({ error: 'slug and title are required' });
    if (googleDriveFolderId) {
      const match = googleDriveFolderId.match(/folders\/([a-zA-Z0-9_-]+)/);
      if (match) googleDriveFolderId = match[1];
    }
    if (googleDrivePdfId) {
      const match = googleDrivePdfId.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) googleDrivePdfId = match[1];
    }
    const roadmap = await Roadmap.findOneAndUpdate(
      { slug },
      { slug, title, description, googleDriveFolderId, googleDrivePdfId, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/roadmaps/:slug', authMiddleware, async (req, res) => {
  try {
    await Roadmap.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/roadmaps/:slug', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug });
    if (!roadmap) return res.status(404).json({ error: 'Not found' });
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health\n`);
});
