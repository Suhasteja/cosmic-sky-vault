# SkyCloud 🌤️

A modern, full-stack cloud-based data management platform with user authentication and CRUD operations.

## ✨ Features

- **🔐 User Authentication**: Secure registration and login with Firebase Auth
- **☁️ Cloud Database**: Real-time data storage with Firebase Firestore
- **📊 CRUD Operations**: Create, Read, Update, Delete records with validation
- **🔍 Search & Filter**: Advanced search and filtering capabilities
- **📱 Mobile Responsive**: Responsive design for all screen sizes
- **🎨 Modern UI**: Built with React, TypeScript, Tailwind CSS, and shadcn/ui
- **⚡ Real-time Updates**: Live data synchronization
- **🛡️ Secure**: Row-level security with Firebase authentication

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **Firebase Authentication** for secure user management
- **Firebase Firestore** for cloud database
- **Real-time data synchronization**

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   ├── dashboard/            # Dashboard components
│   └── ui/                   # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   └── firebase.ts           # Firebase configuration
├── pages/
│   ├── AuthPage.tsx          # Login/Register page
│   └── Dashboard.tsx         # Main dashboard
├── services/
│   └── firestore.ts          # Database operations
├── types/
│   └── index.ts              # TypeScript interfaces
└── App.tsx                   # Main app component
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Modern web browser

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase config and update `src/lib/firebase.ts`

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Detailed Setup Guide

For comprehensive setup instructions, see [SKYCLOUD_SETUP.md](./SKYCLOUD_SETUP.md)

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Records**: Click "Add Record" to create new data entries
3. **View Records**: Browse all your records in card format
4. **Edit Records**: Click the edit icon to modify existing records
5. **Delete Records**: Click the delete icon to remove records
6. **Search**: Use the search bar to find specific records
7. **Filter**: Filter by status (Active/Pending/Completed) or priority

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

The application can be deployed to:
- **Vercel** (recommended)
- **Firebase Hosting**
- **Netlify**
- Any static hosting service

See the detailed setup guide for deployment instructions.

## 🔒 Security Features

- User authentication with Firebase Auth
- Row-level security (users can only access their own data)
- Client-side form validation
- Secure API communication
- HTTPS by default in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support

For issues and questions:
- Check the troubleshooting section in [SKYCLOUD_SETUP.md](./SKYCLOUD_SETUP.md)
- Open an issue on GitHub
- Review Firebase documentation

---

**SkyCloud** - Your data management platform in the cloud ☁️
