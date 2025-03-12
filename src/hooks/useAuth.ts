import { useState, useEffect, useCallback } from "react";
import { authService, getAuthToken, removeAuthToken } from "../services/api";
import { UserProfile } from "../types/api";

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<UserProfile>) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          // Fetch user profile
          const userProfile = await authService.getUserProfile();
          setUser(userProfile);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      // After successful login, fetch user profile
      const userProfile = await authService.getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(
        err?.data?.non_field_errors?.[0] ||
          "Login failed. Please check your credentials.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await authService.register({
          username,
          email,
          password1: password,
          password2: password,
        });
        // Note: In many DRF setups, registration doesn't automatically log the user in
        // You might need to call login after registration or handle as needed
      } catch (err: any) {
        const errorMessage =
          err?.data?.username?.[0] ||
          err?.data?.email?.[0] ||
          err?.data?.password1?.[0] ||
          err?.data?.non_field_errors?.[0] ||
          "Registration failed. Please try again.";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error("Logout failed:", err);
      // Even if the API call fails, we should still clear local state
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
    } catch (err: any) {
      setError(
        err?.data?.email?.[0] ||
          "Password reset request failed. Please try again.",
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<UserProfile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedProfile = await authService.updateUserProfile(userData);
      setUser(updatedProfile);
    } catch (err: any) {
      setError("Failed to update profile. Please try again.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
  };
};
