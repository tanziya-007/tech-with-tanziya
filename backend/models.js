const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


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
  googleDriveFolderId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  date: { type: Date },
  image: String,
  content: String,
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String },
  tech: [String],
  github: String,
  demo: String,
  image: String,
  content: String,
  googleDriveId: String,
  googleDriveFolderId: String,
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
  googleDriveFolderId: String,
  googleDrivePdfId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

userSchema.pre('save', async function () {
  if (this.isModified('password'))
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = {
  CheatSheet: mongoose.model('CheatSheet', cheatSheetSchema),
  Blog: mongoose.model('Blog', blogSchema),
  Project: mongoose.model('Project', projectSchema),
  Resource: mongoose.model('Resource', resourceSchema),
  Roadmap: mongoose.model('Roadmap', roadmapSchema),
  User: mongoose.model('User', userSchema, 'admin')
};
