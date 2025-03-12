import React, { useState } from "react";
import { PlusCircle, Calendar, CheckCircle, ListTodo } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

interface TodoDashboardProps {
  username?: string;
  initialTodos?: Todo[];
}

const TodoDashboard: React.FC<TodoDashboardProps> = ({
  username = "User",
  initialTodos = [
    {
      id: "1",
      title: "Complete project documentation",
      description: "Write up the technical documentation for the new feature",
      completed: false,
      dueDate: "2023-12-15",
      priority: "high",
    },
    {
      id: "2",
      title: "Review pull requests",
      description: "Review and approve team pull requests",
      completed: true,
      dueDate: "2023-12-10",
      priority: "medium",
    },
    {
      id: "3",
      title: "Plan team meeting",
      description: "Prepare agenda for the weekly team meeting",
      completed: false,
      dueDate: "2023-12-12",
      priority: "low",
    },
  ],
}) => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Stats calculations
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // Get upcoming due date
  const getUpcomingDueDate = () => {
    const now = new Date();
    const upcoming = todos
      .filter((todo) => !todo.completed && new Date(todo.dueDate) > now)
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );

    return upcoming.length > 0 ? upcoming[0].dueDate : null;
  };

  const upcomingDueDate = getUpcomingDueDate();

  // Handle todo operations
  const handleCreateTodo = (newTodo: Omit<Todo, "id" | "completed">) => {
    const todo: Todo = {
      ...newTodo,
      id: Date.now().toString(),
      completed: false,
      dueDate: newTodo.dueDate
        ? new Date(newTodo.dueDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    };
    setTodos([...todos, todo]);
    setActiveTab("list");
  };

  const handleEditTodo = (id: string) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setEditingTodo(todoToEdit);
      setActiveTab("create");
    }
  };

  const handleUpdateTodo = (updatedTodo: Partial<Todo>) => {
    if (editingTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === editingTodo.id ? { ...todo, ...updatedTodo } : todo,
        ),
      );
      setEditingTodo(null);
      setActiveTab("list");
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {username}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your tasks and stay organized
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => {
                setEditingTodo(null);
                setActiveTab("create");
              }}
              className="flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Create New Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ListTodo className="h-8 w-8 text-blue-500 mr-3" />
                <div className="text-3xl font-bold">{totalTodos}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">{completedTodos}</div>
                  <div className="text-sm text-gray-500">
                    ({completionRate.toFixed(0)}%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Next Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-500 mr-3" />
                <div className="text-xl font-medium">
                  {upcomingDueDate
                    ? new Date(upcomingDueDate).toLocaleDateString()
                    : "No upcoming tasks"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "list" | "create")}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="list">Task List</TabsTrigger>
            <TabsTrigger value="create">
              {editingTodo ? "Edit Task" : "Create Task"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <TodoList
              todos={todos}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
              onToggleComplete={handleToggleComplete}
            />
          </TabsContent>

          <TabsContent value="create">
            <TodoForm
              onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
              initialData={editingTodo || undefined}
              isEditing={!!editingTodo}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TodoDashboard;
