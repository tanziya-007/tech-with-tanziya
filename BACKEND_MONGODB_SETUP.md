# Backend Setup Guide - TechWithTanziya

## Current Status
✅ Backend server is ready to run
⚠️ MongoDB connection needs to be configured

## Error Explanation
```
MongoDB connection error: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

**Cause:** The `MONGODB_URI` environment variable is not set in the `.env` file.

**Solution:** Configure MongoDB connection string.

---

## Option 1: MongoDB Atlas (Cloud - Recommended for Deployment)

### Step 1: Create Free MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up with email or Google
3. Create a new project
4. Click "Build a Database"
5. Choose "Free" tier (M0)
6. Select cloud provider (AWS/Azure/Google)
7. Click "Create Cluster"

### Step 2: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `admin`
4. Password: Create a strong password (save it!)
5. Click "Add User"

### Step 3: Get Connection String
1. Go to "Databases"
2. Click "Connect" on your cluster
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<password>` with your password
6. Replace `<username>` with your username

### Step 4: Update .env File
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tech-with-tanziya
```

### Step 5: Allow All IPs (for development)
1. Go to "Network Access"
2. Click "Add IP Address"
3. Enter `0.0.0.0/0` (allows all IPs)
4. Click "Confirm"

---

## Option 2: Local MongoDB (Development Only)

### Step 1: Install MongoDB
- **Windows:** Download from https://www.mongodb.com/try/download/community
- **Mac:** `brew install mongodb-community`
- **Linux:** `sudo apt-get install mongodb`

### Step 2: Start MongoDB Service
- **Windows:** MongoDB should start automatically
- **Mac:** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongod`

### Step 3: Update .env File
```
MONGODB_URI=mongodb://localhost:27017/tech-with-tanziya
```

---

## Testing Backend Connection

### Step 1: Update .env File
Edit `backend/.env` and add your MongoDB connection string:
```
MONGODB_URI=your_connection_string_here
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Step 2: Start Backend Server
```bash
cd backend
npm run dev
```

### Step 3: Check for Success
You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📍 API Base URL: http://localhost:5000/api
💚 Health Check: http://localhost:5000/api/health
```

### Step 4: Test API Endpoints
Open in browser or use curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Get cheat sheets
curl http://localhost:5000/api/cheatsheets

# Get blogs
curl http://localhost:5000/api/blogs
```

---

## Common Issues & Solutions

### Issue 1: "MONGODB_URI not configured"
**Solution:** Add `MONGODB_URI` to `.env` file

### Issue 2: "Connection refused"
**Solution:** 
- Check MongoDB is running
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas

### Issue 3: "Authentication failed"
**Solution:**
- Verify username and password
- Check special characters are URL encoded
- Ensure database user has correct permissions

### Issue 4: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

---

## Environment Variables Reference

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Optional
PORT=5000                           # Default: 5000
CORS_ORIGIN=http://localhost:3000   # Default: http://localhost:3000
NODE_ENV=development                # development or production

# Google Drive API (Optional)
GOOGLE_DRIVE_FOLDER_ID=your-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email
GOOGLE_PRIVATE_KEY=your-key
```

---

## API Endpoints

### Health Check
```
GET /api/health
Response: { status: "OK", message: "...", timestamp: "..." }
```

### Cheat Sheets
```
GET /api/cheatsheets          - List all cheat sheets
GET /api/cheatsheets/:slug    - Get specific cheat sheet
```

### Blogs
```
GET /api/blogs                - List all blogs
GET /api/blogs/:slug          - Get specific blog
```

### Projects
```
GET /api/projects             - List all projects
GET /api/projects/:slug       - Get specific project
```

### Resources
```
GET /api/resources            - List all resources
```

### Roadmaps
```
GET /api/roadmaps             - List all roadmaps
GET /api/roadmaps/:slug       - Get specific roadmap
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Production with environment
NODE_ENV=production node server.js
```

---

## Next Steps

1. ✅ Choose MongoDB option (Atlas or Local)
2. ✅ Get connection string
3. ✅ Update `.env` file
4. ✅ Run `npm run dev`
5. ✅ Test endpoints
6. ✅ Connect frontend to backend

---

## Support

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Express.js Docs: https://expressjs.com
- Mongoose Docs: https://mongoosejs.com
- Project Issues: Check GitHub repository

---

## Quick Start (Copy-Paste)

### For MongoDB Atlas:
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tech-with-tanziya
   ```
4. Run: `npm run dev`

### For Local MongoDB:
1. Install MongoDB
2. Start MongoDB service
3. Update `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/tech-with-tanziya
   ```
4. Run: `npm run dev`

---

**Backend is now ready to connect to MongoDB!** 🎉