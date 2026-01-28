# 🚀 How to fix your website for Mobile (Vercel Fix)

I have updated your code so that your website can run properly on your phone! 

### STEP 1: Set up Cloud Database (FREE)
Because "localhost" doesn't work on the internet, you need a Cloud Database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a database and get your **Connection String** (looks like `mongodb+srv://...`).

### STEP 2: Configure Vercel
Go to your project on **Vercel.com**:
1. Click on **Settings** -> **Environment Variables**.
2. Add these two variables:
   - `MONGODB_URI` = (Your MongoDB Atlas Connection String)
   - `JWT_SECRET` = `cafe_delight_super_secret_jwt_key_2024`
   - `NODE_ENV` = `production`

### STEP 3: Push Changes
Now, just push the new files I created (`vercel.json`, `api/index.js`, and updated `server.js`) to your GitHub. Vercel will automatically update.

### STEP 4: Seed the Food Menu
To see the food items on your phone:
1. On your laptop, open the terminal in the `backend` folder.
2. Temporarily change `.env` to use your Cloud MongoDB URL.
3. Run: `node seed.js`.
4. Now your food items are in the cloud and will show up on your phone!

**Note:** I have set the API to `/api`, so your frontend and backend will now work together on the same link: `cafe-red-zeta.vercel.app`.
