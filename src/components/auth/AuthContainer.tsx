import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PasswordResetForm from "./PasswordResetForm";

interface AuthContainerProps {
  defaultTab?: "login" | "register" | "reset";
  onLogin?: (values: any) => void;
  onRegister?: (values: any) => void;
  onPasswordReset?: (values: any) => void;
  isLoading?: boolean;
  error?: string;
}

const AuthContainer = ({
  defaultTab = "login",
  onLogin = () => {},
  onRegister = () => {},
  onPasswordReset = () => {},
  isLoading = false,
  error = "",
}: AuthContainerProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "reset">(
    defaultTab,
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register" | "reset");
  };

  const handleLoginClick = () => {
    setActiveTab("login");
  };

  const handleForgotPasswordClick = () => {
    setActiveTab("reset");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <Tabs
        defaultValue={defaultTab}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <LoginForm onSubmit={onLogin} isLoading={isLoading} error={error} />
          <div className="text-center mt-4">
            <button
              onClick={handleForgotPasswordClick}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <RegisterForm onSubmit={onRegister} onLoginClick={handleLoginClick} />
        </TabsContent>

        <TabsContent value="reset" className="space-y-4">
          <PasswordResetForm onSubmit={onPasswordReset} isLoading={isLoading} />
          <div className="text-center mt-4">
            <button
              onClick={handleLoginClick}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthContainer;
