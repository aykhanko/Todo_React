// API base URL
export const API_BASE_URL = "http://127.0.0.1:8000/api";

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/dj-rest-auth/login/`,
  LOGOUT: `${API_BASE_URL}/dj-rest-auth/logout/`,
  REGISTER: `${API_BASE_URL}/dj-rest-auth/registration/`,
  VERIFY_EMAIL: `${API_BASE_URL}/dj-rest-auth/registration/verify-email/`,
  PASSWORD_CHANGE: `${API_BASE_URL}/dj-rest-auth/password/change/`,
  PASSWORD_RESET: `${API_BASE_URL}/dj-rest-auth/password/reset/`,
  PASSWORD_RESET_CONFIRM: `${API_BASE_URL}/dj-rest-auth/password/reset/confirm/`,
  USER_PROFILE: `${API_BASE_URL}/dj-rest-auth/user/`,
};

// Todo endpoints
export const TODO_ENDPOINTS = {
  TODOS: `${API_BASE_URL}/todos/`,
  TODO_DETAIL: (id: string) => `${API_BASE_URL}/todos/${id}/`,
};

// Token handling
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};

// API request helper with authentication
export const apiRequest = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
  data?: any,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized (token expired or invalid)
    if (response.status === 401) {
      removeAuthToken();
      // Redirect to login or handle as needed
      window.location.href = "/"; // Redirect to home/login page
      throw new Error("Authentication failed. Please login again.");
    }

    // For non-204 responses, parse JSON
    if (response.status !== 204) {
      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, data };
      }

      return data;
    }

    return { success: true };
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth service functions
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiRequest(AUTH_ENDPOINTS.LOGIN, "POST", {
      email,
      password,
    });
    if (response.key) {
      setAuthToken(response.key);
    }
    return response;
  },

  register: async (userData: {
    username: string;
    email: string;
    password1: string;
    password2: string;
  }) => {
    return await apiRequest(AUTH_ENDPOINTS.REGISTER, "POST", userData);
  },

  logout: async () => {
    const response = await apiRequest(AUTH_ENDPOINTS.LOGOUT, "POST");
    removeAuthToken();
    return response;
  },

  resetPassword: async (email: string) => {
    return await apiRequest(AUTH_ENDPOINTS.PASSWORD_RESET, "POST", { email });
  },

  resetPasswordConfirm: async (data: {
    uid: string;
    token: string;
    new_password1: string;
    new_password2: string;
  }) => {
    return await apiRequest(
      AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM,
      "POST",
      data,
    );
  },

  getUserProfile: async () => {
    return await apiRequest(AUTH_ENDPOINTS.USER_PROFILE);
  },

  updateUserProfile: async (userData: any) => {
    return await apiRequest(AUTH_ENDPOINTS.USER_PROFILE, "PATCH", userData);
  },
};

// Todo service functions
export const todoService = {
  getAllTodos: async () => {
    return await apiRequest(TODO_ENDPOINTS.TODOS);
  },

  getTodoById: async (id: string) => {
    return await apiRequest(TODO_ENDPOINTS.TODO_DETAIL(id));
  },

  createTodo: async (todoData: any) => {
    return await apiRequest(TODO_ENDPOINTS.TODOS, "POST", todoData);
  },

  updateTodo: async (id: string, todoData: any) => {
    return await apiRequest(TODO_ENDPOINTS.TODO_DETAIL(id), "PATCH", todoData);
  },

  deleteTodo: async (id: string) => {
    return await apiRequest(TODO_ENDPOINTS.TODO_DETAIL(id), "DELETE");
  },
};
