# Production Deployment Guide

This guide will help you deploy the frontend and backend to separate hosting providers.

## 📋 Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (or other MongoDB hosting)
- Frontend hosting (Vercel, Netlify, etc.)
- Backend hosting (Render, Railway, Heroku, etc.)

---

## 🖥️ Backend Deployment

### Step 1: Prepare Environment Variables

Create a `.env.production` file or set these variables in your hosting provider's dashboard:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/production-db
JWT_SECRET=your-super-secure-random-string-here
SUPERADMIN_USER=admin
SUPERADMIN_PASS=your-secure-password
PORT=5000
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
RAZORPAY_KEY_ID=rzp_live_YourLiveKeyId
RAZORPAY_KEY_SECRET=rzp_live_YourLiveSecret
FAST2SMS_API_KEY=your-production-api-key
```

### Step 2: Deploy Backend

#### Option A: Deploy to Render
1. Connect your GitHub repository
2. Set the following:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`
3. Add environment variables from above
4. Deploy!
5. Note your backend URL: `https://your-app.onrender.com`

#### Option B: Deploy to Railway
1. Connect your GitHub repository
2. Set root directory to `server`
3. Add environment variables
4. Railway will auto-detect Node.js
5. Note your backend URL: `https://your-app.railway.app`

#### Option C: Deploy to Heroku
```bash
cd server
heroku create your-backend-app
heroku config:set MONGO_URI=your-mongo-uri
heroku config:set JWT_SECRET=your-secret
heroku config:set ALLOWED_ORIGINS=https://your-frontend.com
# ... set other env vars
git push heroku main
```

---

## 🌐 Frontend Deployment

### Step 1: Update Environment Variables

Update `client/.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_RAZORPAY_KEY_ID=rzp_live_YourLiveKeyId
```

### Step 2: Build the Frontend

```bash
cd client
npm install
npm run build
```

This creates a `dist` folder with production-ready files.

### Step 3: Deploy Frontend

#### Option A: Deploy to Vercel
```bash
cd client
npm install -g vercel
vercel --prod
```

Or connect via Vercel dashboard:
1. Import your GitHub repository
2. Set **Framework**: Vite
3. Set **Root Directory**: `client`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add environment variable: `VITE_API_BASE_URL=https://your-backend.com`
7. Deploy!

#### Option B: Deploy to Netlify
```bash
cd client
npm install -g netlify-cli
netlify deploy --prod
```

Or via Netlify dashboard:
1. Connect your GitHub repository
2. Set **Base Directory**: `client`
3. Set **Build Command**: `npm run build`
4. Set **Publish Directory**: `client/dist`
5. Add environment variable: `VITE_API_BASE_URL=https://your-backend.com`
6. Deploy!

---

## 🔄 Update CORS Settings

After deploying the frontend, update your backend's `ALLOWED_ORIGINS`:

```env
# In your backend hosting provider's environment variables
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-custom-domain.com
```

---

## ✅ Testing Production Deployment

1. **Test Backend Health**: Visit `https://your-backend.com/health`
2. **Test Frontend**: Visit your frontend URL
3. **Test API Connection**: Try logging in from the frontend
4. **Check CORS**: Ensure no CORS errors in browser console
5. **Test Payment**: Test Razorpay integration (use test keys first!)

---

## 🔒 Security Checklist

- [ ] Changed `JWT_SECRET` to a strong random value
- [ ] Updated superadmin password
- [ ] Using production MongoDB database
- [ ] Using HTTPS for both frontend and backend
- [ ] CORS configured with specific frontend URL (not `*`)
- [ ] Environment variables not committed to Git
- [ ] Using Razorpay live keys (when ready for production)
- [ ] API rate limiting enabled (optional but recommended)

---

## 📝 Quick Reference

### Local Development
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

### Production URLs
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.render.com`
- Health Check: `https://your-backend.render.com/health`

---

## 🆘 Troubleshooting

### CORS Errors
- Ensure `ALLOWED_ORIGINS` in backend includes your frontend URL
- Check that credentials: true is set in both frontend and backend

### API Connection Fails
- Verify `VITE_API_BASE_URL` in frontend points to correct backend URL
- Check backend is running: visit `/health` endpoint

### Build Fails
- Clear node_modules and package-lock.json, reinstall
- Check Node.js version compatibility
- Verify all environment variables are set

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist (set to 0.0.0.0/0 for cloud hosting)
- Check MONGO_URI is correct
- Ensure database user has proper permissions

---

## 📞 Support

For issues, check:
- Server logs in hosting provider dashboard
- Browser console for frontend errors
- MongoDB Atlas logs for database issues
