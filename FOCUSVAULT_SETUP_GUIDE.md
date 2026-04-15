# FocusVault - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Local Development](#local-development)
6. [Deployment](#deployment)
7. [API Documentation](#api-documentation)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**FocusVault** is a full-stack productivity application for managing notes and tasks with features including:

✨ **Features:**
- 🔐 JWT-based authentication with bcrypt password hashing
- 📝 Rich text notes with drag-drop file uploads
- ✅ Task management with priority levels and due dates
- 🏷️ Tags, categories, and search functionality
- 🌙 Dark mode support
- 💾 Auto-save functionality
- 📱 Fully responsive design
- 🎨 Modern glassmorphism UI with Tailwind CSS

**Tech Stack:**
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **File Storage:** Cloudinary
- **Authentication:** JWT + bcryptjs

---

## 🔧 Prerequisites

### System Requirements
- Node.js 16+ and npm 8+
- Git
- MongoDB Atlas account or local MongoDB
- Cloudinary account (free tier works)

### Create Required Accounts

#### 1. MongoDB Atlas (Free)
```bash
# Visit: https://www.mongodb.com/cloud/atlas
# Steps:
# 1. Sign up for free account
# 2. Create a cluster (free tier available)
# 3. Create a database user
# 4. Get connection string (replace password and cluster name)
# Example: mongodb+srv://user:pass@cluster0.mongodb.net/focusvault?retryWrites=true&w=majority
```

#### 2. Cloudinary (Free)
```bash
# Visit: https://cloudinary.com/
# Steps:
# 1. Sign up for free account
# 2. Go to Dashboard
# 3. Copy your Cloud Name, API Key, and API Secret
```

---

## 🚀 Backend Setup

### Step 1: Create Backend Directory & Install Dependencies

```bash
mkdir focusvault
cd focusvault
mkdir focusvault-backend
cd focusvault-backend

npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors multer cloudinary express-validator helmet express-rate-limit
npm install --save-dev nodemon
```

### Step 2: Create Directory Structure

```bash
mkdir models middleware routes
touch server.js .env .gitignore
```

### Step 3: Configure Environment Variables

Create `.env` file:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/focusvault?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 4: Create .gitignore

```
node_modules/
.env
.env.local
.DS_Store
*.log
dist/
```

### Step 5: Update package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 6: Run Backend

```bash
# Terminal in backend directory
npm run dev

# Expected output:
# ✅ MongoDB connected successfully
# 🚀 Server running on http://localhost:5000
```

---

## 🎨 Frontend Setup

### Step 1: Create Frontend & Install Dependencies

```bash
cd ..
mkdir focusvault-frontend
cd focusvault-frontend

npm create vite@latest . -- --template react
npm install
npm install axios react-router-dom react-toastify react-quill date-fns classnames
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 2: Create Directory Structure

```bash
mkdir src/pages src/components src/context src/utils
touch src/App.jsx src/index.css
```

### Step 3: Configure Tailwind CSS

Update `tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  darkMode: 'class',
  plugins: [],
};
```

### Step 4: Create Environment File

Create `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Run Frontend

```bash
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5000/
# ➜  press h to show help
```

---

## 💻 Local Development

### Running Full Stack Locally

**Terminal 1 - Backend:**
```bash
cd focusvault-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd focusvault-frontend
npm run dev
```

Then open http://localhost:5000 in your browser.

### Testing the Application

1. **Sign Up:** Create a new account
2. **Create Notes:** Click "New Note" and add content
3. **Upload Files:** Drag & drop files into note editor
4. **Create Tasks:** Go to Tasks page and create tasks
5. **Filter & Search:** Use search and filter options
6. **Toggle Dark Mode:** Click moon/sun icon in navbar

---

## 🌐 Deployment

### Deploy Backend to Render

#### Step 1: Push to GitHub

```bash
cd focusvault-backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/focusvault-backend.git
git push -u origin main
```

#### Step 2: Create Render Account & Deploy

```bash
# 1. Visit https://render.com
# 2. Click "New +"
# 3. Select "Web Service"
# 4. Connect your GitHub repo
# 5. Configure:
#    - Name: focusvault-backend
#    - Environment: Node
#    - Build Command: npm install
#    - Start Command: npm start
#    - Instance Type: Free (or Paid)
```

#### Step 3: Add Environment Variables in Render Dashboard

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

#### Step 4: Deploy Backend

- Render auto-deploys on push to main
- Your backend URL: `https://focusvault-backend.onrender.com`

---

### Deploy Frontend to Vercel

#### Step 1: Push Frontend to GitHub

```bash
cd focusvault-frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/focusvault-frontend.git
git push -u origin main
```

#### Step 2: Deploy to Vercel

```bash
# Option A: Using Vercel CLI
npm install -g vercel
vercel

# Option B: Using Vercel Dashboard
# 1. Visit https://vercel.com
# 2. Click "Import Project"
# 3. Select your GitHub repo
# 4. Click "Deploy"
```

#### Step 3: Configure Environment Variables in Vercel

- Go to Project Settings → Environment Variables
- Add: `REACT_APP_API_URL=https://focusvault-backend.onrender.com/api`
- Redeploy

#### Step 4: Update Backend FRONTEND_URL

In Render Dashboard, update:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## 📚 API Documentation

### Base URL
- **Local:** `http://localhost:5000/api`
- **Production:** `https://focusvault-backend.onrender.com/api`

### Authentication Endpoints

#### Sign Up
```
POST /auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": { "id": "...", "username": "...", "email": "..." }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

#### Get Profile
```
GET /auth/profile
Authorization: Bearer {token}

Response:
{
  "_id": "...",
  "username": "john_doe",
  "email": "john@example.com",
  "darkMode": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Notes Endpoints

#### Get All Notes
```
GET /notes?search=title&category=work&tag=important&sort=-createdAt
Authorization: Bearer {token}

Response: Array of notes
```

#### Create Note
```
POST /notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content...",
  "tags": ["important", "work"],
  "category": "work",
  "color": "#fffacd"
}

Response:
{
  "message": "Note created",
  "note": { ... }
}
```

#### Update Note
```
PUT /notes/{noteId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["updated"],
  "isPinned": true
}
```

#### Delete Note
```
DELETE /notes/{noteId}
Authorization: Bearer {token}

Response: { "message": "Note deleted" }
```

### Tasks Endpoints

#### Get All Tasks
```
GET /tasks?priority=high&completed=false&sortBy=-dueDate
Authorization: Bearer {token}

Response: Array of tasks
```

#### Create Task
```
POST /tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the FocusVault project",
  "priority": "high",
  "dueDate": "2024-12-31",
  "category": "work"
}
```

#### Update Task
```
PUT /tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "completed": true,
  "priority": "medium"
}
```

#### Delete Task
```
DELETE /tasks/{taskId}
Authorization: Bearer {token}

Response: { "message": "Task deleted" }
```

### File Upload Endpoint

#### Upload File
```
POST /upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: <file_object>

Response:
{
  "message": "File uploaded successfully",
  "url": "https://cloudinary-url...",
  "filename": "document.pdf",
  "fileType": "application",
  "publicId": "focusvault/...",
  "size": 1024
}
```

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Check MongoDB is running locally or
2. Verify MongoDB Atlas connection string
3. Ensure firewall allows MongoDB traffic
4. Check IP whitelist on MongoDB Atlas
```

#### Cloudinary Upload Failed
```
Error: 401 Unauthorized

Solution:
1. Verify CLOUDINARY_API_KEY and API_SECRET
2. Check cloud name is correct
3. Ensure API key has upload permission
4. Check file size (max 50MB)
```

#### JWT Token Error
```
Error: Invalid or expired token

Solution:
1. Generate new token by logging in again
2. Check JWT_SECRET is set in .env
3. Verify token format: "Bearer {token}"
4. Check token hasn't expired
```

### Frontend Issues

#### API Connection Error
```
Error: Cannot read property '_id' of undefined

Solution:
1. Ensure backend is running on port 5000
2. Check REACT_APP_API_URL in .env
3. Verify CORS is enabled in backend
4. Check network tab in DevTools
```

#### Dark Mode Not Persisting
```
Solution:
1. Clear localStorage
2. Check if user preference is saved
3. Verify dark mode class is applied
```

#### File Upload Size Limit
```
Error: File size exceeds limit

Solution:
1. Limit files to 50MB
2. Compress images before upload
3. Use Cloudinary for optimization
```

### Deployment Issues

#### Render Build Fails
```
Solution:
1. Check package.json has all dependencies
2. Ensure .gitignore doesn't exclude node_modules
3. Check Node version (16+ required)
4. Review build logs in Render Dashboard
```

#### Vercel Build Fails
```
Solution:
1. Check all environment variables are set
2. Verify API endpoint is accessible
3. Check build output for errors
4. Ensure index.html is in root
```

#### CORS Errors in Production
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
1. Update FRONTEND_URL in Render backend
2. Verify frontend URL in CORS whitelist
3. Check credentials: true is set
4. Verify Origin header matches
```

---

## 📝 Project Structure

```
focusvault/
├── focusvault-backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   ├── tasks.js
│   │   └── upload.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── focusvault-frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── NotesPage.jsx
    │   │   ├── NoteEditor.jsx
    │   │   └── TasksPage.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🔒 Security Best Practices

1. **Environment Variables:** Never commit `.env` to Git
2. **Password Hashing:** Uses bcryptjs with 10 salt rounds
3. **JWT Secret:** Use strong random key (min 32 chars)
4. **CORS:** Whitelist only frontend domain
5. **Rate Limiting:** Implemented on API routes (100 req/15min)
6. **Helmet:** Security headers enabled
7. **Input Validation:** All endpoints validate input
8. **File Uploads:** Restricted to images, PDFs, docs
9. **HTTPS:** Enable in production (Render/Vercel provide)
10. **API Keys:** Rotate Cloudinary keys regularly

---

## 📞 Support & Resources

- **MongoDB:** https://docs.mongodb.com/
- **Express:** https://expressjs.com/
- **React:** https://react.dev/
- **Tailwind:** https://tailwindcss.com/
- **Cloudinary:** https://cloudinary.com/documentation
- **Render:** https://render.com/docs
- **Vercel:** https://vercel.com/docs

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

**Happy coding! 🚀**
