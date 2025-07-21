# SkyCloud - Full-Stack Web Application Setup

SkyCloud is a modern, responsive web application for cloud-based data management with user authentication and CRUD operations.

## Features

- ✅ **User Authentication**: Secure registration and login with Firebase Auth
- ✅ **Cloud Database**: Data storage with Firebase Firestore
- ✅ **CRUD Operations**: Create, Read, Update, Delete records
- ✅ **Real-time Data**: Dynamic display of data from the database
- ✅ **Form Validation**: Client-side validation with error messages
- ✅ **Mobile Responsive**: Responsive design for all screen sizes
- ✅ **Modern UI**: Built with React, TypeScript, Tailwind CSS, and shadcn/ui
- ✅ **Search & Filter**: Search records and filter by status/priority

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Firebase Authentication** - Secure user authentication
- **Firebase Firestore** - NoSQL cloud database
- **Real-time updates** - Live data synchronization

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Modern web browser

## Installation & Setup

### 1. Clone and Install Dependencies

The project is already set up with all necessary dependencies. If you need to install them:

```bash
npm install
```

### 2. Firebase Setup

#### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "skycloud-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Step 2: Enable Authentication

1. In the Firebase console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Save the changes

#### Step 3: Create Firestore Database

1. Go to "Firestore Database" in the Firebase console
2. Click "Create database"
3. Choose "Start in test mode" (or production mode with security rules)
4. Select a location for your database
5. Click "Done"

#### Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → "Web" (</> icon)
4. Register your app with a nickname
5. Copy the Firebase configuration object

#### Step 5: Configure the Application

Open `src/lib/firebase.ts` and replace the placeholder configuration with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### 3. Firestore Security Rules (Optional but Recommended)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own SkyCloudData
    match /SkyCloudData/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow users to create new documents
    match /SkyCloudData/{document} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4. Run the Application

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:5173
```

## Application Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # User login form
│   │   └── RegisterForm.tsx       # User registration form
│   ├── dashboard/
│   │   ├── RecordForm.tsx         # Add/Edit record form
│   │   └── RecordList.tsx         # Display records list
│   └── ui/                        # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx            # Authentication context
├── lib/
│   └── firebase.ts                # Firebase configuration
├── pages/
│   ├── AuthPage.tsx               # Authentication page
│   └── Dashboard.tsx              # Main dashboard page
├── services/
│   └── firestore.ts               # Firestore CRUD operations
├── types/
│   └── index.ts                   # TypeScript interfaces
└── App.tsx                        # Main application component
```

## Data Model

The application uses a `SkyCloudData` collection in Firestore with the following structure:

```typescript
interface SkyCloudRecord {
  id?: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Completed' | 'Pending';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

## Usage Guide

### 1. User Registration/Login

- Visit the application URL
- New users: Click "Sign up" to create an account
- Existing users: Use email/password to log in
- Form validation provides real-time feedback

### 2. Dashboard Features

#### Adding Records
- Click "Add Record" button
- Fill in required fields (Title, Description, Category)
- Select Priority and Status
- Click "Add Record" to save

#### Viewing Records
- All user records are displayed in card format
- See title, description, category, priority, and status
- View creation and modification dates

#### Editing Records
- Click the edit icon (pencil) on any record
- Modify fields in the popup form
- Click "Update Record" to save changes

#### Deleting Records
- Click the delete icon (trash) on any record
- Confirm deletion in the popup dialog
- Record is permanently removed

#### Search and Filter
- Use the search bar to find records by title, description, or category
- Filter by Status: All, Active, Pending, Completed
- Filter by Priority: All, Low, Medium, High

### 3. User Management

- User info displayed in header
- "Refresh" button to reload data
- "Logout" button to sign out securely

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set environment variables if needed
4. Deploy automatically

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Other Platforms

The application can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage

## Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure all Firebase config values are correct
   - Check that Firebase project is properly set up

2. **Authentication Issues**
   - Verify Email/Password is enabled in Firebase Auth
   - Check network connectivity

3. **Database Permission Errors**
   - Ensure Firestore security rules allow user access
   - Verify user is properly authenticated

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors in the console

### Getting Help

- Check browser console for error messages
- Verify Firebase project configuration
- Ensure all required services are enabled
- Test with a fresh user account

## Security Best Practices

1. **Never commit Firebase config with sensitive data**
2. **Use environment variables for production**
3. **Implement proper Firestore security rules**
4. **Keep dependencies updated**
5. **Use HTTPS in production**

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**SkyCloud** - Your data management platform in the cloud 🌤️