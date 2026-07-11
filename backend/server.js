require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { CheatSheet, Blog, Project, Resource, Roadmap } = require('./models');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));
} else {
  console.warn('⚠️  MONGODB_URI not configured. Database features will not work.');
  console.warn('📝 Please set MONGODB_URI in .env file');
  console.warn('📚 Get a free MongoDB cluster at: https://www.mongodb.com/cloud/atlas');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Cheat Sheets
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

// Blogs
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

// Projects
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

// Resources
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Roadmaps
app.get('/api/roadmaps', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health\n`);
});
