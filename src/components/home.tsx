import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import AuthContainer from "./auth/AuthContainer";
import TodoDashboard from "./todo/TodoDashboard";
import UserProfile from "./profile/UserProfile";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
}

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"dashboard" | "profile">(
    "dashboard",
  );

  const navigate = useNavigate();

  // Simulated authentication check on component mount
  useEffect(() => {
    // Check for token in localStorage (in a real app)
    const token = localStorage.getItem("authToken");
    if (token) {
      // In a real app, you would validate the token with your backend
      setIsAuthenticated(true);
      // Mock user data
      setUser({
        id: "1",
        username: "johndoe",
        email: "john.doe@example.com",
        name: "John Doe",
        bio: "Frontend developer passionate about creating intuitive user experiences.",
      });
    }
  }, []);

  // Handle login
  const handleLogin = (values: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    setIsLoading(true);
    setAuthError("");

    // Simulate API call
    setTimeout(() => {
      // Mock successful login
      if (
        values.email === "demo@example.com" &&
        values.password === "password"
      ) {
        const mockUser = {
          id: "1",
          username: "demouser",
          email: values.email,
          name: "Demo User",
        };

        // Store token in localStorage
        localStorage.setItem("authToken", "mock-jwt-token");

        setUser(mockUser);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // Mock login failure
        setAuthError("Invalid email or password");
        setIsLoading(false);
      }
    }, 1000);
  };

  // Handle registration
  const handleRegister = (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setAuthError("");

    // Simulate API call
    setTimeout(() => {
      // Mock successful registration
      const mockUser = {
        id: "1",
        username: values.username,
        email: values.email,
        name: values.username,
      };

      // Store token in localStorage
      localStorage.setItem("authToken", "mock-jwt-token");

      setUser(mockUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  // Handle password reset
  const handlePasswordReset = (values: { email: string }) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Just simulate the process completing
      setIsLoading(false);
    }, 1000);
  };

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("authToken");

    setUser(null);
    setIsAuthenticated(false);
    setActiveView("dashboard");
  };

  // Handle profile update
  const handleProfileUpdate = (values: any) => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Update user data
      setUser((prev) => (prev ? { ...prev, ...values } : null));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar
        isAuthenticated={isAuthenticated}
        username={user?.username}
        onLogout={handleLogout}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <AuthContainer
              onLogin={handleLogin}
              onRegister={handleRegister}
              onPasswordReset={handlePasswordReset}
              isLoading={isLoading}
              error={authError}
            />
          </div>
        ) : (
          <div className="w-full">
            {activeView === "dashboard" ? (
              <TodoDashboard username={user?.name} />
            ) : (
              <UserProfile
                user={user || undefined}
                onSave={handleProfileUpdate}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </main>

      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 flex space-x-4">
          <button
            onClick={() => setActiveView("dashboard")}
            className={`p-3 rounded-full shadow-lg ${activeView === "dashboard" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView("profile")}
            className={`p-3 rounded-full shadow-lg ${activeView === "profile" ? "bg-primary text-white" : "bg-white text-gray-700"}`}
          >
            Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
