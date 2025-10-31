# Sufi Backend Server

This is the backend server for the Sufi e-commerce application with authentication and MongoDB integration.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sufi
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. MongoDB Setup
Make sure you have MongoDB installed and running locally, or use MongoDB Atlas.

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in existing user
- `GET /api/auth/profile` - Get user profile (protected)

### Test
- `GET /api/test` - Test if server is running

## Features
- User registration and login
- JWT token authentication
- Password hashing with bcrypt
- MongoDB integration
- CORS enabled for frontend integration
