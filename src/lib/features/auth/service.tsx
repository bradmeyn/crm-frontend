// services/auth.ts

import { type LoginCredentials, type RegisterCredentials } from "./schemas";
import { api, type ApiError } from "@services/api";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  first_name: string; // Changed to match Django field names
  last_name: string; // Changed to match Django field names
  phone: string;
  business: {
    // Changed to match nested business object
    id: string;
    name: string;
  };
}

interface TokenResponse {
  access: string; // Django JWT format
  refresh: string; // Django JWT format
}

interface AuthResponse extends TokenResponse {
  user: User;
}

export async function register(data: RegisterCredentials) {
  try {
    const response = await api.post<AuthResponse>("/auth/register/", data);
    console.log("Registration response", response.data);

    if (response.data.access) {
      localStorage.setItem("access", response.data.access); // Store as access (matches Django)
      localStorage.setItem("refresh", response.data.refresh); // Store as refresh (matches Django)
    }

    // Store user data if included in response
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.detail || // Added detail for Django errors
          errorData?.errors?.join(", ") ||
          "Registration failed"
      );
    }
    throw error;
  }
}

export async function login(data: LoginCredentials) {
  try {
    const response = await api.post<AuthResponse>("/auth/token/", data); // Now returns user data too

    // Store tokens (Django returns 'access' and 'refresh')
    if (response.data.access) {
      localStorage.setItem("access", response.data.access); // Store as access (matches Django)
      localStorage.setItem("refresh", response.data.refresh); // Store as refresh (matches Django)
    }

    // Store user data (now included thanks to CustomTokenObtainPairSerializer)
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(errorData?.error || errorData?.detail || "Login failed");
    }
    throw error;
  }
}

export async function logout() {
  try {
    // Clear all stored auth data
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    // Clear all auth data even if logout fails
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    throw error;
  }
}

export async function refreshToken() {
  try {
    const refreshTokenValue = localStorage.getItem("refresh");

    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<TokenResponse>("/auth/token/refresh/", {
      refresh: refreshTokenValue, // Django expects 'refresh' field
    });

    // Update stored tokens (Django returns 'access' and 'refresh')
    localStorage.setItem("access", response.data.access); // Store as access
    if (response.data.refresh) {
      localStorage.setItem("refresh", response.data.refresh); // Store as refresh
    }

    return response.data;
  } catch (error) {
    // If refresh fails, clear all auth data and redirect to login
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    throw error;
  }
}

// Helper function to get the current access token
export function getAccessToken(): string | null {
  return localStorage.getItem("access");
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const refreshToken = localStorage.getItem("refresh");
  return !!(token && refreshToken);
}

// Helper function to get current user
export function getCurrentUser(): User | null {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}
