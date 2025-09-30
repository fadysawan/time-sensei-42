// Authentication service for REST API backend
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'facebook';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

class AuthService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    return response;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.setToken(response.token);
    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    return response;
  }

  async loginWithGoogle(): Promise<void> {
    // For OAuth2, redirect to the backend OAuth2 authorization endpoint
    // Note: OAuth2 endpoints are at /api/oauth2/ not /api/v1/oauth2/
    const oauth2BaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/v1', '') || 'http://localhost:8080/api';
    window.location.href = `${oauth2BaseUrl}/oauth2/authorization/google`;
  }

  async loginWithFacebook(): Promise<void> {
    // For OAuth2, redirect to the backend OAuth2 authorization endpoint
    const oauth2BaseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/v1', '') || 'http://localhost:8080/api';
    window.location.href = `${oauth2BaseUrl}/oauth2/authorization/facebook`;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.warn('Logout request failed:', error);
    } finally {
      this.clearToken();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    this.setToken(response.token);
    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    return response;
  }

  async resetPassword(email: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const authService = new AuthService();