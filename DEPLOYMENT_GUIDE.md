# TechWithTanziya - Deployment Guide

## Prerequisites
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Vercel account (free)
- [ ] Railway/Render account (free)

## Step 1: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Add IP whitelist (0.0.0.0/0 for development)

## Step 2: Deploy Backend (Choose one)

### Option A: Railway.app (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy backend
cd backend
railway up
```

### Option B: Render.com
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables from `.env.production`

## Step 3: Deploy Frontend on Vercel

### Via Vercel Dashboard:
1. Go to [Vercel](https://vercel.com)
2. Import GitHub repository
3. Configure project:
   - Framework: Next.js
   - Root Directory: `.` (root)
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., https://your-backend.railway.app/api)

### Via Vercel CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

## Step 4: Configure CORS
Update backend `.env.production`:
```
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

## Step 5: Test Deployment
1. Frontend: https://your-project.vercel.app
2. Backend API: https://your-backend.railway.app/api/cheatsheets
3. Test all features:
   - Navigation
   - Content loading
   - Theme toggle
   - Responsive design

## Step 6: Set Up Custom Domain (Optional)
1. Buy domain from Namecheap/GoDaddy
2. Add domain in Vercel dashboard
3. Configure DNS records
4. Update CORS origin in backend

## Environment Variables Reference

### Frontend (.env.production):
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Backend (.env.production):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Check CORS_ORIGIN matches frontend URL
   - Include protocol (https://)
   - No trailing slash

2. **Database Connection Failed**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check Node.js version (requires 18+)
   - Verify all dependencies in package.json
   - Check TypeScript compilation errors

4. **API Not Responding**
   - Verify backend is running
   - Check PORT configuration
   - Test API endpoint directly

## Monitoring
- Vercel Analytics for frontend
- Railway/Render logs for backend
- MongoDB Atlas metrics
- Uptime monitoring (UptimeRobot)

## Backup Strategy
1. Regular database backups (MongoDB Atlas automated)
2. GitHub repository as code backup
3. Environment variables backup
4. Uploaded files backup (if using Google Drive)

## Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Database credentials rotated
- [ ] Regular dependency updates
- [ ] Security headers configured

## Support
- Vercel Documentation: https://vercel.com/docs
- Railway Documentation: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Project Issues: GitHub repository issues