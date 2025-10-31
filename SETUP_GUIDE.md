# Sufi E-commerce Authentication Setup Guide

This guide will help you set up the complete authentication system with MongoDB integration.

## 🚀 Quick Start

### 1. Backend Setup

#### Install Backend Dependencies
```bash
cd server
npm install
```

#### Create Environment File
Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sufi
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Start Backend Server
```bash
cd server
npm run dev
```

### 2. Frontend Setup

#### Install Frontend Dependencies (if not already done)
```bash
cd ..  # Go back to main project directory
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

## 📋 Prerequisites

### MongoDB Setup
You need MongoDB installed and running. You have two options:

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/sufi`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your Atlas connection string

## 🔧 Features Implemented

### ✅ Authentication System
- **User Registration**: Create new accounts with email and password
- **User Login**: Sign in with existing credentials
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Password Hashing**: Secure password storage with bcrypt
- **Session Management**: Persistent login sessions

### ✅ Frontend Integration
- **Sign In Modal**: Beautiful modal for authentication
- **User State Management**: Global authentication state
- **Protected Routes**: Cart page requires authentication
- **User Profile Display**: Shows user name in navigation
- **Sign Out Functionality**: Secure logout with token removal

### ✅ Database Integration
- **MongoDB Schema**: User model with validation
- **Data Persistence**: User data stored in MongoDB
- **Error Handling**: Proper error messages for users

## 🎯 How It Works

### 1. User Registration
1. User clicks "Sign In" button
2. Modal opens with sign-up form
3. User enters name, email, and password
4. Data sent to `/api/auth/signup` endpoint
5. Password hashed and user saved to MongoDB
6. JWT token generated and returned
7. User automatically signed in

### 2. User Login
1. User clicks "Sign In" button
2. Modal opens with sign-in form
3. User enters email and password
4. Data sent to `/api/auth/signin` endpoint
5. Password verified against stored hash
6. JWT token generated and returned
7. User signed in

### 3. Protected Features
- **Cart Access**: Only authenticated users can access cart
- **User Profile**: Shows user name in navigation
- **Session Persistence**: Login state maintained across browser sessions

## 🔒 Security Features

- **Password Hashing**: Passwords encrypted with bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Cross-origin request protection
- **Error Handling**: Secure error messages

## 📱 User Experience

- **Responsive Design**: Works on mobile and desktop
- **Loading States**: Visual feedback during authentication
- **Toast Notifications**: Success and error messages
- **Form Validation**: Client-side validation with helpful messages
- **Auto-login**: Remembers user sessions

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in existing user
- `GET /api/auth/profile` - Get user profile (protected)

### Test
- `GET /api/test` - Test if server is running

## 🚨 Troubleshooting

### Common Issues

1. **"Network error" message**
   - Make sure backend server is running on port 5000
   - Check if MongoDB is running

2. **"MongoDB connection error"**
   - Verify MongoDB is installed and running
   - Check connection string in `.env` file

3. **"User already exists"**
   - Try signing in instead of signing up
   - Or use a different email address

4. **"Invalid email or password"**
   - Double-check email and password
   - Make sure you're using the correct credentials

### Development Tips

- Use browser dev tools to check network requests
- Check server console for error messages
- Verify MongoDB connection in server logs
- Test API endpoints with Postman or similar tool

## 🎉 Success!

Once everything is set up, you'll have:
- ✅ Working authentication system
- ✅ User data stored in MongoDB
- ✅ Protected cart functionality
- ✅ Persistent user sessions
- ✅ Beautiful UI/UX

Your e-commerce app now has a complete authentication system! 🚀
