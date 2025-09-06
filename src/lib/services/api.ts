import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export interface ApiError {
  error?: string;
  message?: string;
  detail?: string;
  errors?: string[];
}

// Create axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Create a new axios instance to avoid interceptor loops
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || "/api"}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { access } = refreshResponse.data;
        localStorage.setItem("access_token", access);

        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Refresh failed, clear all auth data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        // Redirect to login page
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
