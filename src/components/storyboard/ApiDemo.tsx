import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL, AUTH_ENDPOINTS, TODO_ENDPOINTS } from "@/services/api";

const ApiDemo = () => {
  const [activeTab, setActiveTab] = useState("auth");
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResponse(null);
    setError(null);
  };

  const displayEndpoints = () => {
    if (activeTab === "auth") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Authentication Endpoints</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                POST {AUTH_ENDPOINTS.LOGIN}
              </span>
              <span className="text-xs text-gray-500">Login</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                POST {AUTH_ENDPOINTS.LOGOUT}
              </span>
              <span className="text-xs text-gray-500">Logout</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                POST {AUTH_ENDPOINTS.REGISTER}
              </span>
              <span className="text-xs text-gray-500">Register</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                POST {AUTH_ENDPOINTS.PASSWORD_RESET}
              </span>
              <span className="text-xs text-gray-500">Password Reset</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                GET/PUT/PATCH {AUTH_ENDPOINTS.USER_PROFILE}
              </span>
              <span className="text-xs text-gray-500">User Profile</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Todo Endpoints</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                GET {TODO_ENDPOINTS.TODOS}
              </span>
              <span className="text-xs text-gray-500">List all todos</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                POST {TODO_ENDPOINTS.TODOS}
              </span>
              <span className="text-xs text-gray-500">Create todo</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                GET {TODO_ENDPOINTS.TODO_DETAIL("id")}
              </span>
              <span className="text-xs text-gray-500">Get todo details</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                PUT/PATCH {TODO_ENDPOINTS.TODO_DETAIL("id")}
              </span>
              <span className="text-xs text-gray-500">Update todo</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">
                DELETE {TODO_ENDPOINTS.TODO_DETAIL("id")}
              </span>
              <span className="text-xs text-gray-500">Delete todo</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Base URL:{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">{API_BASE_URL}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="todos">Todos</TabsTrigger>
          </TabsList>
          <TabsContent value="auth" className="space-y-4">
            {displayEndpoints()}
          </TabsContent>
          <TabsContent value="todos" className="space-y-4">
            {displayEndpoints()}
          </TabsContent>
        </Tabs>

        {response && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Response:</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-lg font-medium text-red-700 mb-2">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-gray-500">
          These endpoints require proper authentication with JWT tokens.
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiDemo;
