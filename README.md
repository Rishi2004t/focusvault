# 🎯 FocusVault - Modern Note Taking & Task Management App

<div align="center">

![FocusVault](https://img.shields.io/badge/FocusVault-v1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-13AA52?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**A powerful, intuitive, and beautiful productivity app built with modern web technologies**

[Quick Start](#-quick-start) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 📝 Notes Management
- ✍️ Create, edit, and delete rich text notes
- 🏷️ Organize with tags and categories
- 📌 Pin important notes to the top
- 🔍 Full-text search across all notes
- 🎨 Custom note colors
- 💾 Auto-save every 30 seconds
- 📸 Drag & drop file attachments (images, PDFs, documents)

### ✅ Task Management
- 📋 Create tasks with title, description, and due dates
- 🎯 Set priority levels (Low, Medium, High)
- ✔️ Track completion status
- 📅 Filter by due date, priority, or status
- 📊 View completion statistics
- 📌 Link tasks to notes

### 🔐 Security & Authentication
- 🛡️ JWT-based authentication
- 🔒 Bcrypt password hashing
- 🚫 Rate limiting (100 requests/15 min)
- 🌐 CORS protection
- 📝 Input validation on all endpoints

### 🎨 User Experience
- 🌙 Dark mode with persistent preference
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Fast and smooth animations
- 🎯 Intuitive glassmorphism UI
- 🔔 Toast notifications for user feedback
- ♿ Accessible components

### ☁️ Cloud Integration
- 📦 Cloudinary for file storage
- 🔗 Automatic file optimization
- 🌍 CDN-backed delivery
- 📤 Drag & drop uploads

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **date-fns** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - File storage
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - File hosting

---

## 🚀 Quick Start

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/yourusername/focusvault.git
cd focusvault
```

### 2️⃣ **Backend Setup**
```bash
cd focusvault-backend
npm install

# Create .env file with your credentials
cat > .env << EOF
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EOF

npm run dev
```

### 3️⃣ **Frontend Setup** (New Terminal)
```bash
cd focusvault-frontend
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

npm run dev
```

### 4️⃣ **Open Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

### 5️⃣ **Create Account & Explore**
- Sign up with email and password
- Create your first note
- Add tasks and set priorities
- Toggle dark mode (top-right)

**[Full Setup Guide →](./FOCUSVAULT_SETUP_GUIDE.md)**

---

## 📁 Project Structure

```
focusvault/
├── focusvault-backend/                 # Express server
│   ├── models/                         # MongoDB schemas
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── Task.js
│   ├── routes/                         # API endpoints
│   │   ├── auth.js                     # Authentication
│   │   ├── notes.js                    # Note CRUD
│   │   ├── tasks.js                    # Task CRUD
│   │   └── upload.js                   # File uploads
│   ├── middleware/
│   │   └── auth.js                     # JWT verification
│   ├── server.js                       # Entry point
│   └── package.json
│
├── focusvault-frontend/                # React app
│   ├── src/
│   │   ├── pages/                      # Route components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NotesPage.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── components/                 # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Auth state management
│   │   ├── utils/
│   │   │   └── api.js                  # Axios instance
│   │   ├── App.jsx                     # Main component
│   │   ├── index.jsx                   # Entry point
│   │   └── index.css                   # Global styles
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind configuration
│   └── package.json
│
├── QUICK_START.md                      # 5-minute setup guide
├── FOCUSVAULT_SETUP_GUIDE.md           # Comprehensive documentation
└── README.md                           # This file
```

---

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get running in 5 minutes
- **[Full Setup Guide](./FOCUSVAULT_SETUP_GUIDE.md)** - Complete setup & deployment
- **[API Documentation](#-api-documentation)** - Detailed endpoint reference

### 🔗 API Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user settings
- `POST /auth/logout` - Logout user

#### Notes
- `GET /notes` - Get all notes with filters & search
- `GET /notes/:id` - Get single note
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `POST /notes/:id/attachment` - Add attachment
- `DELETE /notes/:id/attachment/:attachmentId` - Remove attachment

#### Tasks
- `GET /tasks` - Get all tasks with filters
- `GET /tasks/:id` - Get single task
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/:id/subtask` - Add subtask
- `PATCH /tasks/:id/subtask/:subtaskIndex` - Toggle subtask

#### Files
- `POST /upload` - Upload file to Cloudinary
- `DELETE /upload/:publicId` - Delete file from Cloudinary

**[Full API Docs →](./FOCUSVAULT_SETUP_GUIDE.md#-api-documentation)**

---

## 🌐 Deployment

### Deploy Backend to Render (Free)

1. Push code to GitHub
2. Connect to Render.com
3. Add environment variables
4. Deploy!

**[Detailed Steps →](./FOCUSVAULT_SETUP_GUIDE.md#deploy-backend-to-render)**

### Deploy Frontend to Vercel (Free)

1. Push code to GitHub
2. Connect to Vercel.com
3. Add REACT_APP_API_URL
4. Deploy!

**[Detailed Steps →](./FOCUSVAULT_SETUP_GUIDE.md#deploy-frontend-to-vercel)**

---

## 🔒 Security Features

- ✅ JWT token-based authentication
- ✅ Bcrypt password hashing (10 salt rounds)
- ✅ CORS protection
- ✅ Rate limiting (100 req/15 min)
- ✅ Helmet security headers
- ✅ Input validation & sanitization
- ✅ Secure file upload validation
- ✅ HTTPS enforced in production
- ✅ Environment variables for secrets
- ✅ MongoDB Atlas encryption

---

## 📈 Performance

- ⚡ Vite for instant HMR
- 📦 Code splitting for faster loads
- 🗜️ Cloudinary optimization for images
- 💾 MongoDB indexing for fast queries
- 🔄 Caching strategies implemented
- 📊 Bundle size optimized with tree-shaking
- 🎯 Lazy loading for components

---

## 🐛 Known Issues & Limitations

### Current Limitations
- Single-user mode (no note sharing yet)
- File size limit: 50MB per file
- No offline support yet
- Email notifications not implemented

### Future Features
- 👥 Note & task sharing
- 📧 Email notifications
- 🔄 Real-time sync with WebSockets
- 📱 Mobile app (React Native)
- 🤖 AI-powered task suggestions
- 📊 Advanced analytics & insights
- 🗣️ Comments on notes
- 🔗 Task dependencies

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- 📖 Check [Full Documentation](./FOCUSVAULT_SETUP_GUIDE.md)
- 🐛 Report issues on GitHub
- 💡 Suggest features via GitHub Issues
- 📧 Email support: support@focusvault.app

---

## 🙏 Acknowledgments

- React & Vite teams for amazing tools
- Tailwind CSS for beautiful utility classes
- MongoDB for flexible database
- Cloudinary for reliable file hosting
- Vercel & Render for free deployment

---

<div align="center">

**Made with ❤️ by the FocusVault Team**

[⬆ Back to Top](#-focusvault---modern-note-taking--task-management-app)

</div>
