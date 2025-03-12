import { useState, useEffect, useCallback } from "react";
import { todoService } from "../services/api";
import { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types/api";

interface UseTodosReturn {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (todoData: CreateTodoRequest) => Promise<Todo>;
  updateTodo: (id: string, todoData: UpdateTodoRequest) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoComplete: (id: string, completed: boolean) => Promise<Todo>;
}

export const useTodos = (): UseTodosReturn => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err: any) {
      setError("Failed to fetch todos. Please try again.");
      console.error("Error fetching todos:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load todos on mount
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = useCallback(
    async (todoData: CreateTodoRequest): Promise<Todo> => {
      setIsLoading(true);
      setError(null);
      try {
        const newTodo = await todoService.createTodo(todoData);
        setTodos((prev) => [...prev, newTodo]);
        return newTodo;
      } catch (err: any) {
        setError("Failed to create todo. Please try again.");
        console.error("Error creating todo:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const updateTodo = useCallback(
    async (id: string, todoData: UpdateTodoRequest): Promise<Todo> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedTodo = await todoService.updateTodo(id, todoData);
        setTodos((prev) =>
          prev.map((todo) => (todo.id === id ? updatedTodo : todo)),
        );
        return updatedTodo;
      } catch (err: any) {
        setError("Failed to update todo. Please try again.");
        console.error("Error updating todo:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const deleteTodo = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err: any) {
      setError("Failed to delete todo. Please try again.");
      console.error("Error deleting todo:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTodoComplete = useCallback(
    async (id: string, completed: boolean): Promise<Todo> => {
      return updateTodo(id, { completed });
    },
    [updateTodo],
  );

  return {
    todos,
    isLoading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
  };
};
