# Frontend-Backend Integration Guide

This document explains how the frontend and backend applications are integrated for authentication.

## Architecture Overview

- **Frontend**: React + Vite application running on `http://localhost:5173`
- **Backend**: Spring Boot application running on `http://localhost:8080`
- **Authentication**: JWT tokens with OAuth2 social login support

## Setup Instructions

### 1. Backend Setup

1. **Database Setup**:
   ```bash
   # Create PostgreSQL database
   createdb timesensei
   createdb timesensei_dev
   ```

2. **Environment Variables**:
   Create `.env` file in the backend root:
   ```env
   DB_USERNAME=timesensei
   DB_PASSWORD=password
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Run Backend**:
   ```bash
   cd timesensei-backend-api
   mvn spring-boot:run
   ```

### 2. Frontend Setup

1. **Environment Variables**:
   Create `.env` file in the frontend root:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

2. **Run Frontend**:
   ```bash
   cd time-sensei-42
   npm install
   npm run dev
   ```

## Authentication Flow

### 1. Email/Password Login

1. User enters credentials in frontend
2. Frontend sends POST request to `/api/v1/auth/login`
3. Backend validates credentials and returns JWT token
4. Frontend stores token and redirects to dashboard

### 2. OAuth2 Social Login

1. User clicks "Login with Google/Facebook"
2. Frontend redirects to backend OAuth2 endpoint
3. Backend handles OAuth2 flow with provider
4. On success, backend redirects to frontend callback page
5. Frontend callback page fetches user data and tokens
6. User is logged in and redirected to dashboard

## API Endpoints

### Authentication Endpoints

- `POST /api/v1/auth/login` - Email/password login
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/reset-password` - Password reset

### OAuth2 Endpoints

- `GET /oauth2/authorization/google` - Google OAuth2 login
- `GET /oauth2/authorization/facebook` - Facebook OAuth2 login
- `GET /api/v1/auth/oauth2/success` - OAuth2 success handler
- `GET /api/v1/auth/oauth2/failure` - OAuth2 failure handler

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:4173` (Vite preview)
- `http://localhost:3000` (Alternative dev server)
- `http://localhost:3001` (Alternative dev server)

## Testing the Integration

1. **Start both applications**:
   ```bash
   # Terminal 1 - Backend
   cd timesensei-backend-api
   mvn spring-boot:run

   # Terminal 2 - Frontend
   cd time-sensei-42
   npm run dev
   ```

2. **Test Email/Password Login**:
   - Navigate to `http://localhost:5173/login
   - Try logging in with email/password

3. **Test OAuth2 Login**:
   - Click "Login with Google" or "Login with Facebook"
   - Complete OAuth2 flow
   - Verify redirect to dashboard

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS configuration includes frontend URL
2. **OAuth2 Redirect Issues**: Check OAuth2 provider configuration
3. **Token Issues**: Verify JWT secret is consistent
4. **Database Issues**: Ensure PostgreSQL is running and databases exist

### Debug Steps

1. Check browser network tab for failed requests
2. Check backend logs for authentication errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with Postman/curl

## Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- OAuth2 credentials should be kept secure
- Use HTTPS in production
- Implement proper token refresh logic
- Add rate limiting for authentication endpoints

