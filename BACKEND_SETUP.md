# Backend Setup Guide

## Architecture Overview

```
Google Drive (Content Source)
    ↓
Backend API (Node.js/Express)
    ↓
MongoDB (Database)
    ↓
Next.js Frontend (Fetches via API)
```

## Step 1: MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string: `mongodb+srv://<username>:<password>@cluster.mongodb.net/tech-with-tanziya`
5. Copy this to `backend/.env` as `MONGODB_URI`

## Step 2: Google Drive Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Drive API
4. Create a Service Account:
   - Go to "Service Accounts"
   - Create new service account
   - Generate JSON key
5. Share your Google Drive folder with the service account email
6. Add to `backend/.env`:
   - `GOOGLE_DRIVE_FOLDER_ID` - Your folder ID from the URL
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` - From the JSON key
   - `GOOGLE_PRIVATE_KEY` - From the JSON key

## Step 3: Backend Installation

```bash
cd backend
npm install
```

## Step 4: Create .env file

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `backend/.env` with your MongoDB and Google Drive credentials.

## Step 5: Run Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

## Step 6: Run Frontend

In the root directory:

```bash
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

## Step 7: Run Both Together

```bash
npm run dev:full
```

This runs both frontend and backend concurrently.

## API Endpoints

### Cheat Sheets
- `GET /api/cheatsheets` - Get all cheat sheets
- `GET /api/cheatsheets/:slug` - Get single cheat sheet

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:slug` - Get single blog

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:slug` - Get single project

### Resources
- `GET /api/resources` - Get all resources

### Roadmaps
- `GET /api/roadmaps` - Get all roadmaps
- `GET /api/roadmaps/:slug` - Get single roadmap

## Next Steps

1. Update your Next.js pages to use the API client from `lib/api.ts`
2. Set up Google Drive sync (optional - for automatic content updates)
3. Add authentication for admin endpoints (optional)
4. Deploy backend to a service like Railway, Render, or Heroku
5. Update `NEXT_PUBLIC_API_URL` in production environment
