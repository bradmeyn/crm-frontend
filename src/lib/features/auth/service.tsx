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
  access: string;
  refresh: string;
}

interface AuthResponse extends TokenResponse {
  user: User;
}

export async function register(data: RegisterCredentials) {
  try {
    const response = await api.post<AuthResponse>("/auth/register/", data);
    console.log("Registration response", response.data);

    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access); // Store as access (matches Django)
      localStorage.setItem("refresh_token", response.data.refresh); // Store as refresh (matches Django)
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
      localStorage.setItem("access_token", response.data.access); // Store as access (matches Django)
      localStorage.setItem("refresh_token", response.data.refresh); // Store as refresh (matches Django)
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
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    return true;
  } catch (error) {
    console.error("Logout error:", error);
    // Clear all auth data even if logout fails
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    throw error;
  }
}

export async function refreshToken() {
  try {
    const refreshTokenValue = localStorage.getItem("refresh_token");

    if (!refreshTokenValue) {
      throw new Error("No refresh token available");
    }

    // Use direct axios to avoid interceptor loops
    const response = await axios.post<TokenResponse>(
      `${import.meta.env.VITE_API_URL || "/api"}/auth/token/refresh/`,
      { refresh: refreshTokenValue },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    localStorage.setItem("access_token", response.data.access);
    if (response.data.refresh) {
      localStorage.setItem("refresh_token", response.data.refresh);
    }

    return response.data;
  } catch (error) {
    console.error("Token refresh error:", error);
    // Clear all auth data on refresh failure
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    throw error;
  }
}

// Helper function to get the current access token
export function getAccessToken(): string | null {
  return localStorage.getItem("access_token");
}

// Helper function to check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const refreshToken = localStorage.getItem("refresh_token");

  if (!token || !refreshToken) return false;

  // Optional: Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch {
    return false; // Invalid token format
  }
}

// Helper function to get current user
export function getCurrentUser(): User | null {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}
