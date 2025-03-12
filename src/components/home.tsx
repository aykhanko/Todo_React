import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import AuthContainer from "./auth/AuthContainer";
import TodoDashboard from "./todo/TodoDashboard";
import UserProfile from "./profile/UserProfile";
import { useAuthContext } from "@/context/AuthContext";

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
  const {
    isAuthenticated,
    user,
    error: authError,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
  } = useAuthContext();
  const [activeView, setActiveView] = useState<"dashboard" | "profile">(
    "dashboard",
  );

  const navigate = useNavigate();

  // Handle login
  const handleLogin = async (values: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }) => {
    try {
      await login(values.email, values.password);
      // Redirect to todos page after successful login
      navigate("/todos");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Handle registration
  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      await register(values.username, values.email, values.password);
      // After registration, we need to log in
      await login(values.email, values.password);
      navigate("/todos");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (values: { email: string }) => {
    try {
      await resetPassword(values.email);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (values: any) => {
    // This is now handled in the UserProfile component directly
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <AuthContainer
              onLogin={handleLogin}
              onRegister={handleRegister}
              onPasswordReset={handlePasswordReset}
              isLoading={isLoading}
              error={authError || ""}
            />
          </div>
        ) : (
          <div className="w-full">
            {/* Redirect to the appropriate route instead of conditionally rendering */}
            {navigate("/todos")}
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
