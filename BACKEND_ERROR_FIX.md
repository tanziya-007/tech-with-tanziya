# Backend Terminal Error - FIXED ✅

## Error Found
```
MongoDB connection error: MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

## Root Cause
The `MONGODB_URI` environment variable was not configured in the `.env` file.

## Solution Applied

### 1. Created `.env` File
Location: `backend/.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tech-with-tanziya
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 2. Improved Server Error Handling
Updated `backend/server.js` to:
- Check if `MONGODB_URI` is configured before connecting
- Show helpful error messages if not configured
- Add health check endpoint (`/api/health`)
- Better logging with emojis for clarity

### 3. Created Setup Guides
- `BACKEND_MONGODB_SETUP.md` - Comprehensive MongoDB setup guide
- `setup-backend.bat` - Windows setup script
- `setup-backend.sh` - Linux/Mac setup script

---

## How to Fix the Error

### Option 1: MongoDB Atlas (Cloud - Recommended)

**Step 1: Create Free Cluster**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a new project
4. Click "Build a Database"
5. Choose "Free" tier (M0)
6. Select cloud provider
7. Click "Create Cluster"

**Step 2: Create Database User**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `admin`
4. Password: Create strong password
5. Click "Add User"

**Step 3: Get Connection String**
1. Go to "Databases"
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string
5. Replace `<password>` with your password

**Step 4: Update `.env` File**
```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster.mongodb.net/tech-with-tanziya
```

**Step 5: Allow All IPs**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Enter `0.0.0.0/0`
4. Click "Confirm"

### Option 2: Local MongoDB

**Step 1: Install MongoDB**
- Windows: Download from https://www.mongodb.com/try/download/community
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`

**Step 2: Start MongoDB**
- Windows: Should start automatically
- Mac: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`

**Step 3: Update `.env` File**
```
MONGODB_URI=mongodb://localhost:27017/tech-with-tanziya
```

---

## Testing Backend After Setup

### Step 1: Update `.env` File
Edit `backend/.env` with your MongoDB connection string

### Step 2: Start Backend
```bash
cd backend
npm run dev
```

### Step 3: Expected Output
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📍 API Base URL: http://localhost:5000/api
💚 Health Check: http://localhost:5000/api/health
```

### Step 4: Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get cheat sheets
curl http://localhost:5000/api/cheatsheets

# Get blogs
curl http://localhost:5000/api/blogs
```

---

## Files Modified/Created

### Modified
- `backend/server.js` - Added error handling and health check

### Created
- `backend/.env` - Environment configuration
- `backend/test-server.js` - Test server for debugging
- `BACKEND_MONGODB_SETUP.md` - Detailed setup guide
- `setup-backend.bat` - Windows setup script
- `setup-backend.sh` - Linux/Mac setup script

---

## Quick Setup Commands

### Windows
```bash
# Run setup script
setup-backend.bat

# Or manually
cd backend
npm run dev
```

### Mac/Linux
```bash
# Run setup script
bash setup-backend.sh

# Or manually
cd backend
npm run dev
```

---

## Environment Variables Reference

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Optional
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development

# Google Drive API (Optional)
GOOGLE_DRIVE_FOLDER_ID=your-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email
GOOGLE_PRIVATE_KEY=your-key
```

---

## Common Issues & Solutions

### Issue: "MONGODB_URI not configured"
**Solution:** Add connection string to `backend/.env`

### Issue: "Connection refused"
**Solution:** 
- Check MongoDB is running
- Verify connection string
- Check IP whitelist in MongoDB Atlas

### Issue: "Authentication failed"
**Solution:**
- Verify username/password
- Check special characters are URL encoded
- Ensure database user has permissions

### Issue: "Port 5000 already in use"
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

## API Endpoints Available

```
GET /api/health              - Server health check
GET /api/cheatsheets         - List all cheat sheets
GET /api/cheatsheets/:slug   - Get specific cheat sheet
GET /api/blogs               - List all blogs
GET /api/blogs/:slug         - Get specific blog
GET /api/projects            - List all projects
GET /api/projects/:slug      - Get specific project
GET /api/resources           - List all resources
GET /api/roadmaps            - List all roadmaps
GET /api/roadmaps/:slug      - Get specific roadmap
```

---

## Next Steps

1. ✅ Choose MongoDB option (Atlas or Local)
2. ✅ Get connection string
3. ✅ Update `backend/.env`
4. ✅ Run `npm run dev` in backend folder
5. ✅ Test endpoints
6. ✅ Connect frontend to backend

---

## Support Resources

- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express.js: https://expressjs.com
- Mongoose: https://mongoosejs.com
- Node.js: https://nodejs.org

---

## Status Summary

✅ Backend server code fixed
✅ Error handling improved
✅ Setup guides created
✅ Environment configuration ready
⏳ Waiting for MongoDB connection string

**Next Action:** Configure MongoDB and update `.env` file

---

**Backend is now ready to connect to MongoDB!** 🎉