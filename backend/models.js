const mongoose = require('mongoose');

const cheatSheetSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  highlights: [String],
  topics: [String],
  interviews: [String],
  image: String,
  content: String,
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  image: String,
  content: String,
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tech: [String],
  github: String,
  demo: String,
  image: String,
  content: String,
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const resourceSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  link: { type: String, required: true },
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const roadmapSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  steps: [String],
  image: String,
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  CheatSheet: mongoose.model('CheatSheet', cheatSheetSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Project: mongoose.model('Project', projectSchema),
  Resource: mongoose.model('Resource', resourceSchema),
  Roadmap: mongoose.model('Roadmap', roadmapSchema)
};
