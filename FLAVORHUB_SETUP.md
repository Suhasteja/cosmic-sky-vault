# FlavorHub Setup Guide 🍽️

This comprehensive guide will help you set up FlavorHub, a modern recipe sharing platform, from scratch.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- A **Firebase account** (free)
- A modern web browser
- Basic knowledge of React and TypeScript (helpful but not required)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd flavorhub

# Install dependencies
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `flavorhub` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Optionally enable **Google** sign-in for better UX

#### Set up Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

#### Enable Firebase Storage
1. Go to **Storage**
2. Click "Get started"
3. Accept the default security rules (for development)
4. Choose the same location as your Firestore
5. Click "Done"

#### Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register app with name "FlavorHub"
5. Copy the configuration object

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update `.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Update Firebase Config File

Edit `src/lib/firebase.ts` and replace the placeholder config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Advanced Configuration

### Nutrition API Integration (Optional)

FlavorHub supports automatic nutrition calculation using external APIs:

#### Option 1: Edamam API (Recommended)
1. Sign up at [Edamam Developer](https://developer.edamam.com/)
2. Create a new application for "Nutrition Analysis API"
3. Get your App ID and App Key
4. Add to `.env`:
   ```env
   VITE_EDAMAM_APP_ID=your-app-id
   VITE_EDAMAM_APP_KEY=your-app-key
   ```

#### Option 2: Spoonacular API
1. Sign up at [Spoonacular](https://spoonacular.com/food-api)
2. Get your API key from the dashboard
3. Add to `.env`:
   ```env
   VITE_SPOONACULAR_API_KEY=your-api-key
   ```

### Firebase Security Rules

For production, update your Firestore security rules:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Recipes are public for reading, but only owners can write
    match /recipes/{recipeId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

```javascript
// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recipes/{recipeId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 Features Overview

### Core Features
- ✅ User authentication (email/password)
- ✅ Recipe creation with image upload
- ✅ Recipe browsing and search
- ✅ Like and comment system
- ✅ User profiles
- ✅ Responsive design

### Advanced Features
- ✅ Advanced filtering (cuisine, difficulty, calories)
- ✅ Nutrition calculation (manual + API)
- ✅ Social sharing
- ✅ Real-time updates
- ✅ Tag system

## 🎯 Usage Guide

### For Users
1. **Sign Up**: Create an account with email/password
2. **Browse Recipes**: Explore recipes from the community
3. **Search & Filter**: Find recipes by ingredients, cuisine, etc.
4. **Interact**: Like and comment on recipes you enjoy
5. **Share**: Share recipes via social media or copy links

### For Recipe Creators
1. **Create Recipe**: Click "Create Recipe" to add a new recipe
2. **Add Details**: Include title, description, ingredients, and steps
3. **Upload Image**: Add an appetizing photo of your dish
4. **Set Nutrition**: Use auto-calculate or enter manually
5. **Publish**: Share your recipe with the community

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Deploy to Firebase Hosting

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

## 🔍 Troubleshooting

### Common Issues

**1. Firebase Connection Error**
- Check your API keys in `.env`
- Ensure Firebase project is properly configured
- Verify network connectivity

**2. Image Upload Not Working**
- Check Firebase Storage rules
- Ensure Storage is enabled in Firebase Console
- Verify file size limits

**3. Authentication Issues**
- Enable Email/Password in Firebase Auth
- Check authentication domain settings
- Clear browser cache and cookies

**4. Nutrition API Not Working**
- API keys are optional - the app works without them
- Check API key validity and quotas
- Fallback estimation will be used if APIs fail

### Getting Help

1. Check the browser console for error messages
2. Review Firebase Console for any service issues
3. Ensure all environment variables are set correctly
4. Check network connectivity and API quotas

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update components in `src/components/ui/` for design changes
- Add custom CSS in `src/index.css`

### Features
- Add new cuisine types in `src/types/recipe.ts`
- Extend nutrition tracking in `src/services/nutritionService.ts`
- Add new filters in `src/components/recipes/RecipeFilters.tsx`

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for user tracking
- Firebase Analytics for app usage
- Error tracking with Sentry
- Performance monitoring

## 🔒 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Implement proper Firebase rules** for production
4. **Validate user input** on both client and server
5. **Use HTTPS** in production
6. **Regular security audits** of dependencies

## 🚀 Performance Optimization

1. **Image optimization**: Compress images before upload
2. **Lazy loading**: Implement for recipe cards
3. **Caching**: Use React Query for data caching
4. **Bundle optimization**: Analyze and optimize bundle size
5. **CDN**: Use Firebase CDN for global distribution

---

**FlavorHub** - Happy cooking and sharing! 🍽️

For additional support, check the main README.md or open an issue on GitHub.