// Auth types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  key: string;
  user?: UserProfile;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}

export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
}

// Todo types
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
  created_at?: string;
  updated_at?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

// API Error types
export interface ApiError {
  status: number;
  data: {
    detail?: string;
    [key: string]: any;
  };
}
