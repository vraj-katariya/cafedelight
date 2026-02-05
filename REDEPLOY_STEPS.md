# 🔄 How to Redeploy on Vercel

Environment variables (like `NODE_ENV`, `MONGODB_URI`) **only start working after you redeploy**.

Here are 2 easy ways to redeploy:

## Method 1: Vercel Dashboard (Easiest)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project **cafedelight-iks9**
3. Click on the **Deployments** tab (top menu)
4. Find the top/latest deployment
5. Click the **three dots (...)** button on the right
6. Click **Redeploy**
7. Confirm by clicking **Redeploy** again

Wait 2-3 minutes for it to finish. Once it says "Ready", your changes are live!

## Method 2: Using Command Line (Git)

If you have Git set up, you can trigger a deploy by pushing an empty commit:

```bash
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

Vercel will detect the push and start building automatically.

## ✅ How to Verify

After redeployment is complete:
1. Go to `https://cafedelight-iks9.vercel.app/api/health`
2. You should see `success: true` and `dbStatus: connected`
