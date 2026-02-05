  # 🔴 Server Error - Quick Fix Guide

## Your Error: "Server error" on Login

This happens when the API cannot connect to the database or environment variables are missing.

## ✅ Quick Fix Steps

### Step 1: Check Environment Variables in Vercel

**THIS IS THE MOST COMMON ISSUE!**

1. Go to: https://vercel.com/dashboard
2. Click on your project: **cafedelight-iks9**
3. Go to: **Settings** → **Environment Variables**
4. Check if you have these 3 variables:
   - ✅ `MONGODB_URI`
   - ✅ `JWT_SECRET`
   - ✅ `NODE_ENV`

**If ANY are missing, add them now:**

#### Add MONGODB_URI:
- Name: `MONGODB_URI`
- Value: Your MongoDB connection string
- Example: `mongodb+srv://username:password@cluster.mongodb.net/cafedelight`

#### Add JWT_SECRET:
- Name: `JWT_SECRET`
- Value: Any random string
- Example: `my-super-secret-key-12345`

#### Add NODE_ENV:
- Name: `NODE_ENV`
- Value: `production`

**After adding variables, you MUST redeploy:**
- Go to **Deployments** tab
- Click the **...** menu on latest deployment
- Click **Redeploy**

---

### Step 2: Check MongoDB Atlas Network Access

1. Go to: https://cloud.mongodb.com
2. Click **Network Access** (left sidebar)
3. Check if you have an entry for `0.0.0.0/0`

**If NOT, add it:**
- Click **Add IP Address**
- Click **Allow Access from Anywhere**
- Click **Confirm**

This allows Vercel to connect to your database.

---

### Step 3: Check Vercel Deployment Logs

1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click on the latest deployment
4. Click **Functions** tab
5. Click on `api/index.js`
6. Look for error messages

**Common errors you might see:**
- `MongooseServerSelectionError` = MongoDB connection failed
- `JWT_SECRET is not defined` = Environment variable missing
- `MONGODB_URI is not defined` = Environment variable missing

---

### Step 4: Test API Health

After fixing above issues, test:

Open in browser: `https://cafedelight-iks9.vercel.app/api/health`

**Good Response:**
```json
{
  "success": true,
  "message": "Cafe Delight API is running",
  "dbStatus": "connected"
}
```

**Bad Response:**
```json
{
  "success": false,
  "message": "Database connection failed"
}
```

If bad response, go back to Step 1 and Step 2.

---

## 🎯 Most Likely Solution

**99% of the time, it's missing environment variables!**

1. Add the 3 environment variables in Vercel
2. Redeploy
3. Test login again

---

## 📞 Still Not Working?

If you still see "Server error" after:
- ✅ Adding environment variables
- ✅ Allowing `0.0.0.0/0` in MongoDB
- ✅ Redeploying

Then:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try to login
4. Take a screenshot of any errors
5. Share with me

I can help debug further!
