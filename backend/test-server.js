// Test server with different port
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { CheatSheet, Blog, Project, Resource, Roadmap } = require('./models');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', status: 'OK' });
});

// Cheat Sheets test endpoint
app.get('/api/test/cheatsheets', async (req, res) => {
  try {
    // Try to connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    console.log('MongoDB connected for test');
    
    const sheets = await CheatSheet.find().limit(2).select('-content');
    res.json({ 
      success: true, 
      count: sheets.length,
      sheets: sheets,
      message: 'Database connection successful'
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      message: 'Using fallback data - database not configured'
    });
  }
});

const PORT = 5001; // Different port
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`Database test: http://localhost:${PORT}/api/test/cheatsheets`);
});