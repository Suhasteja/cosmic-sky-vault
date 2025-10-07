# FlavorHub 🍽️

A modern, full-stack recipe sharing platform where food lovers can discover, create, share, and interact with amazing recipes from around the world.

## ✨ Features

- **🔐 User Authentication**: Secure registration and login with Firebase Auth
- **📸 Image Upload**: Upload and store recipe images with Firebase Storage
- **🍳 Recipe Management**: Create, view, edit, and delete recipes with detailed information
- **❤️ Social Features**: Like, comment, and share recipes
- **🔍 Advanced Search**: Search by ingredients, cuisine, difficulty, and more
- **🏷️ Smart Filtering**: Filter by cuisine, difficulty, calories, and tags
- **📊 Nutrition Tracking**: Display detailed nutrition information
- **👤 User Profiles**: Personal profile pages with user statistics
- **📱 Mobile Responsive**: Beautiful responsive design for all devices
- **🎨 Modern UI**: Built with React, TypeScript, Tailwind CSS, and shadcn/ui
- **⚡ Real-time Updates**: Live data synchronization

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Hook Form** with Zod validation
- **Lucide React** for icons
- **Sonner** for toast notifications
- **date-fns** for date formatting

### Backend
- **Firebase Authentication** for secure user management
- **Firebase Firestore** for cloud database
- **Firebase Storage** for image uploads
- **Real-time data synchronization**

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   ├── recipes/              # Recipe-related components
│   │   ├── RecipeCard.tsx    # Recipe card display
│   │   ├── RecipeForm.tsx    # Recipe creation form
│   │   ├── RecipeDetail.tsx  # Detailed recipe view
│   │   └── RecipeFilters.tsx # Search and filter components
│   └── ui/                   # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   ├── firebase.ts           # Firebase configuration
│   └── utils.ts              # Utility functions
├── pages/
│   ├── AuthPage.tsx          # Login/Register page
│   ├── RecipesPage.tsx       # Main recipes page
│   └── ProfilePage.tsx       # User profile page
├── services/
│   └── recipeService.ts      # Recipe database operations
├── types/
│   ├── index.ts              # General TypeScript interfaces
│   └── recipe.ts             # Recipe-specific types
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
4. Enable Firebase Storage
5. Get your Firebase config and update `src/lib/firebase.ts`

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 Usage

### For Users
1. **Register/Login**: Create an account or sign in
2. **Browse Recipes**: Explore recipes from other users
3. **Search & Filter**: Find recipes by cuisine, ingredients, difficulty, etc.
4. **Like & Comment**: Interact with recipes you love
5. **Share Recipes**: Share recipes via social media or copy links

### For Recipe Creators
1. **Create Recipes**: Add detailed recipes with images, ingredients, and steps
2. **Manage Recipes**: Edit or delete your own recipes
3. **Track Performance**: See likes and comments on your recipes
4. **Profile Management**: View your recipe portfolio

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

The application can be deployed to:
- **Vercel** (recommended for frontend)
- **Firebase Hosting**
- **Netlify**
- Any static hosting service

Make sure to configure environment variables for Firebase in your deployment platform.

## 🔒 Security Features

- User authentication with Firebase Auth
- Row-level security (users can only edit their own recipes)
- Image upload validation and security rules
- Client-side form validation with Zod
- Secure API communication
- HTTPS by default in production

## 🍳 Recipe Features

### Recipe Information
- Title, description, and high-quality images
- Cuisine type and difficulty level
- Cooking time and serving size
- Detailed ingredient lists
- Step-by-step instructions
- Nutrition information (calories, protein, fat, carbs)
- Tags for categorization

### Social Features
- Like/unlike recipes
- Comment on recipes
- Share recipes via Web Share API or clipboard
- User profiles with recipe statistics
- Recipe discovery and recommendations

### Search & Filter
- Text search across titles, descriptions, and ingredients
- Filter by cuisine type
- Filter by difficulty level
- Calorie range filtering
- Tag-based filtering
- Sort by newest, most liked, or lowest calories

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
- Open an issue on GitHub
- Review Firebase documentation
- Check React and TypeScript documentation

---

**FlavorHub** - Where food lovers share their passion 🍽️