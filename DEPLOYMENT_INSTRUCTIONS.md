# 🚀 Vercel Deployment Instructions - Cafe Delight

## ✅ Code Changes Complete!

All necessary code fixes have been applied. Now follow these steps to deploy:

## Step 1: Set Environment Variables in Vercel

**CRITICAL:** You must add these environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project: `cafedelight-iks9`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `MONGODB_URI` | Your MongoDB connection string | Example: `mongodb+srv://username:password@cluster.mongodb.net/cafedelight` |
| `JWT_SECRET` | Any secure random string | Example: `your-super-secret-jwt-key-12345` |
| `NODE_ENV` | `production` | Exactly as shown |

### How to Get MongoDB URI:
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `cafedelight`

## Step 2: Install New Dependencies

Run this command in your project folder:

```bash
npm install
```

## Step 3: Commit and Push Changes

```bash
git add .
git commit -m "Fix API for Vercel deployment"
git push
```

## Step 4: Deploy to Vercel

Vercel will automatically deploy when you push to Git. Or manually deploy:

```bash
vercel --prod
```

## Step 5: Test Your Deployment

After deployment completes:

### Test API Health:
Open in browser: `https://cafedelight-iks9.vercel.app/api/health`

Should see:
```json
{
  "success": true,
  "message": "Cafe Delight API is running",
  "dbStatus": "connected"
}
```

### Test Registration:
1. Go to: `https://cafedelight-iks9.vercel.app`
2. Click **"Create one"** link
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Phone: (optional)
4. Click **Register**
5. Should redirect to booking page ✅

### Test Login:
1. Go to: `https://cafedelight-iks9.vercel.app/login`
2. Enter your credentials
3. Click **Sign In**
4. Should redirect successfully ✅

### Test Admin Login:
- Email: `admin@cafedelight.com`
- Password: (your admin password)
- Should redirect to admin dashboard ✅

## 🔧 What Was Fixed

1. ✅ **API Serverless Function** - Properly configured for Vercel
2. ✅ **MongoDB Connection** - Added connection caching for serverless
3. ✅ **CORS Headers** - Enabled cross-origin requests
4. ✅ **Function Timeout** - Increased to 10 seconds
5. ✅ **Dependencies** - Added all required packages
6. ✅ **Error Handling** - Better error messages

## ⚠️ Troubleshooting

### If API returns 500 error:
- Check environment variables are set correctly in Vercel
- Check MongoDB Atlas allows connections from `0.0.0.0/0`
- Check Vercel deployment logs for errors

### If login/registration still doesn't work:
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login/register
4. Check the `/api/auth/login` or `/api/auth/register` request
5. Look at the response - it will show the error

### MongoDB Connection Issues:
1. Go to MongoDB Atlas
2. Click **Network Access**
3. Add IP Address: `0.0.0.0/0` (allows all)
4. Click **Confirm**

## 📞 Need Help?

If you see any errors, share:
1. The error message from browser console
2. The API response from Network tab
3. Screenshot of the issue

Your app should now work perfectly! 🎉
