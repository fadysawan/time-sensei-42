# Authentication System

This directory contains all authentication-related components and functionality for the Time Sensei application.

## Overview

The authentication system is designed to work with a backend REST API and supports:
- Email/password authentication
- Google OAuth integration
- Facebook OAuth integration
- Protected routes
- User session management

## Components

### Core Components

- **AuthContext** (`../contexts/AuthContext.tsx`) - Main authentication context provider
- **AuthService** (`../services/authService.ts`) - API service for authentication endpoints
- **ProtectedRoute** (`ProtectedRoute.tsx`) - Route guard for authenticated users

### UI Components

- **AuthModal** (`AuthModal.tsx`) - Modal containing login/signup forms
- **LoginForm** (`LoginForm.tsx`) - Email/password login form
- **SignupForm** (`SignupForm.tsx`) - User registration form
- **SocialLoginButtons** (`SocialLoginButtons.tsx`) - Google/Facebook OAuth buttons
- **UserMenu** (`UserMenu.tsx`) - User dropdown menu with logout

### Pages

- **Login** (`../../pages/Login.tsx`) - Login page with authentication modal

## Backend API Endpoints

The authentication system expects the following backend endpoints:

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/reset-password
GET  /api/auth/me
```

### OAuth Endpoints

```
POST /api/auth/google
POST /api/auth/facebook
```

## Environment Variables

Create a `.env` file in the project root with:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## Usage

### 1. Authentication Context

```tsx
import { useAuth } from '@/hooks/useAuth';

const { currentUser, login, logout, loading } = useAuth();
```

### 2. Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### 3. Authentication Modal

```tsx
import { AuthModal } from '@/components/auth/AuthModal';

<AuthModal 
  isOpen={isOpen} 
  onClose={onClose} 
  defaultMode="login" 
/>
```

## API Request/Response Formats

### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "https://example.com/avatar.jpg",
    "provider": "email",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Signup Request
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

## Error Handling

The authentication system includes comprehensive error handling:
- Network errors
- Authentication failures
- Token expiration
- Invalid credentials
- Server errors

## Security Features

- JWT token management
- Automatic token refresh
- Secure token storage
- Protected route guards
- Session persistence
- Logout on token expiration

## Integration with Existing App

The authentication system is fully integrated with:
- React Router for navigation
- Existing context providers
- Global header component
- Theme system
- UI component library



