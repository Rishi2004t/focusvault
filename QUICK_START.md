# FocusVault - Quick Start (5 Minutes)

## ⚡ Express Setup

### 1. Prerequisites Checklist
- [ ] Node.js v16+ installed (`node --version`)
- [ ] MongoDB Atlas account created (free tier)
- [ ] Cloudinary account created (free tier)

### 2. Get MongoDB Connection String
```bash
# Go to: https://www.mongodb.com/cloud/atlas
# 1. Login/Create account
# 2. Create free cluster
# 3. Click "Connect" → "Drivers" → Copy connection string
# 4. Replace <password> with your password
```

### 3. Get Cloudinary Credentials
```bash
# Go to: https://cloudinary.com/
# 1. Login/Create account
# 2. Go to Dashboard
# 3. Copy: Cloud Name, API Key, API Secret
```

### 4. Backend Setup (2 minutes)

```bash
# Clone or create project
mkdir focusvault && cd focusvault

# Create backend
mkdir focusvault-backend && cd focusvault-backend

# Copy all backend files from the code above into this directory
# Then:

npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/focusvault
JWT_SECRET=super_secret_key_at_least_32_characters_long_change_me_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# Start backend
npm run dev
# Expected: ✅ MongoDB connected & 🚀 Server running on http://localhost:5000
```

### 5. Frontend Setup (2 minutes)

In a new terminal:
```bash
# From focusvault root directory
mkdir focusvault-frontend && cd focusvault-frontend

# Copy all frontend files from the code above

npm install
```

Create `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

```bash
# Start frontend
npm run dev
# Expected: ➜ Local: http://localhost:5173
```

### 6. Use the App (1 minute)

1. Open http://localhost:5173
2. Click "Sign up"
3. Create account (username, email, password)
4. Explore:
   - **Dashboard:** View stats, recent notes & tasks
   - **Notes:** Create notes with drag-drop file uploads
   - **Tasks:** Create tasks with priority and due dates
   - **Theme:** Toggle dark mode (top-right icon)

---

## 🚀 Deploy to Cloud (5 minutes)

### Option A: Deploy Backend to Render (Free)

1. Push to GitHub:
```bash
cd focusvault-backend
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/focusvault-backend
git push -u origin main
```

2. Go to https://render.com
   - Click "New Web Service"
   - Connect GitHub repo
   - Set Start Command: `npm start`
   - Add env variables from `.env`
   - Deploy!

3. Your URL: `https://focusvault-backend.onrender.com`

### Option B: Deploy Frontend to Vercel (Free)

1. Push to GitHub:
```bash
cd focusvault-frontend
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USERNAME/focusvault-frontend
git push -u origin main
```

2. Go to https://vercel.com
   - Click "Import Project"
   - Select GitHub repo
   - Add env: `REACT_APP_API_URL=https://your-backend.onrender.com/api`
   - Deploy!

3. Your URL: `https://your-app.vercel.app`

---

## 🎯 Features Walkthrough

### 📝 Notes
- **Create:** Click "New Note" button
- **Edit:** Click any note card
- **Upload:** Drag & drop files (images, PDFs, docs)
- **Search:** Use search bar to find notes
- **Filter:** By category or tags
- **Pin:** Star icon to pin important notes
- **Autosave:** Saves every 30 seconds

### ✅ Tasks
- **Create:** Fill form and click "Add Task"
- **Priority:** Low, Medium, High
- **Due Date:** Set deadline
- **Complete:** Check checkbox when done
- **Filter:** By priority or status
- **Delete:** Click trash icon

### 🌙 Dark Mode
- Click moon/sun icon in top-right
- Preference saved automatically

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection error | Verify connection string in `.env` |
| Cloudinary upload fails | Check API key & secret are correct |
| Frontend can't connect to API | Ensure backend is running on port 5000 |
| Dark mode doesn't work | Clear localStorage & refresh |
| Files not uploading | Check file size < 50MB |

---

## 📚 Full Documentation

See `FOCUSVAULT_SETUP_GUIDE.md` for:
- Detailed setup instructions
- Complete API documentation
- Deployment guides
- Security best practices
- Troubleshooting

---

## 💡 Next Steps

1. ✅ Get running locally
2. ✅ Customize styling in Tailwind config
3. ✅ Add more features (notes sharing, advanced search)
4. ✅ Deploy to production
5. ✅ Invite users & gather feedback

---

**Happy building! 🎉**
