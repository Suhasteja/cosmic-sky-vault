# FlavorHub - Recipe Sharing Platform

A modern, full-stack recipe sharing platform built with Next.js, Firebase Authentication, and MongoDB. Share your favorite recipes, discover new flavors, and connect with food lovers from around the world.

## Features

- 🔐 **Authentication**: Secure login/signup with Firebase
- 📝 **Recipe Management**: Create, edit, and share recipes
- 🖼️ **Image Upload**: Upload recipe images
- ❤️ **Social Features**: Like, comment, and share recipes
- 🔍 **Search & Filter**: Find recipes by cuisine, ingredients, or keywords
- 📊 **Nutrition Info**: Track calories and macronutrients
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: Firebase Auth
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flavorhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/flavorhub

   # Spoonacular API (optional, for nutrition data)
   NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key
   ```

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Get your Firebase config and add it to `.env.local`

5. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
flavorhub/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── recipes/       # Recipe endpoints
│   │   │   └── users/         # User endpoints
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   ├── profile/
│   │   ├── create/            # Recipe creation
│   │   └── recipes/           # Recipe listing & details
│   ├── components/            # React components
│   ├── lib/                   # Utilities & configs
│   ├── models/                # MongoDB models
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── package.json
```

## API Endpoints

### Recipes
- `GET /api/recipes` - Get all recipes (with search/filter)
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/[id]` - Get recipe by ID
- `PUT /api/recipes/[id]` - Update recipe (like/unlike)
- `POST /api/recipes/[id]/comments` - Add comment

### Users
- `GET /api/users` - Get user by email
- `POST /api/users` - Create new user

## Features in Detail

### Authentication
- Firebase Authentication with email/password
- Automatic user creation in MongoDB
- Protected routes and user context

### Recipe Management
- Rich recipe creation form
- Image upload (placeholder implementation)
- Ingredient and step management
- Nutrition information tracking

### Social Features
- Like/unlike recipes
- Comment system
- Share recipes (native share API)
- User profiles with recipe history

### Search & Discovery
- Text search across titles, descriptions, and ingredients
- Filter by cuisine type
- Sort by popularity, date, or alphabetically
- Pagination for large datasets

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Vercel, Railway, or Render
- **Database**: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js and Tailwind CSS