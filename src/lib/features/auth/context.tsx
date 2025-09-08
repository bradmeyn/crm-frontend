import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";

import * as authService from "./service";
import { User } from "./service";
import { type LoginCredentials } from "./schemas";

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if we have a valid token
        if (authService.isAuthenticated()) {
          console.log("Token found, fetching user...");
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            console.log("User data found in localStorage:", currentUser);
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token exists but no user data - fetch from API or clear
            console.log("No user data found, logging out...");
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token or invalid token
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        try {
          await authService.logout();
        } catch (logoutError) {
          console.error("Logout error during init:", logoutError);
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
