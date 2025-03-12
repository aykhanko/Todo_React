import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Search, Filter } from "lucide-react";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: "low" | "medium" | "high";
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: (completed: boolean) => void;
}

// Inline TodoItem component since the imported one isn't available yet
const TodoItem = ({
  id,
  title,
  description,
  completed,
  dueDate,
  priority,
  onEdit,
  onDelete,
  onToggleComplete,
}: TodoItemProps) => {
  return (
    <Card className="p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Checkbox
          id={`todo-${id}`}
          checked={completed}
          onCheckedChange={(checked) => onToggleComplete(checked as boolean)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`font-medium ${completed ? "line-through text-gray-500" : "text-gray-900"}`}
              >
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                Delete
              </Button>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-gray-500">
              Due: {new Date(dueDate).toLocaleDateString()}
            </span>
            <span
              className={`
              ${priority === "high" ? "text-red-500" : ""}
              ${priority === "medium" ? "text-orange-500" : ""}
              ${priority === "low" ? "text-green-500" : ""}
            `}
            >
              Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface TodoListProps {
  todos?: Todo[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string, completed: boolean) => void;
}

const TodoList = ({
  todos = [
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
  onEdit = (id) => console.log(`Edit todo ${id}`),
  onDelete = (id) => console.log(`Delete todo ${id}`),
  onToggleComplete = (id, completed) =>
    console.log(`Toggle todo ${id} to ${completed}`),
}: TodoListProps) => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter todos based on active filter and search term
  const filteredTodos = todos.filter((todo) => {
    // Filter by status
    if (filter === "active" && todo.completed) return false;
    if (filter === "completed" && !todo.completed) return false;

    // Filter by search term
    if (
      searchTerm &&
      !todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Tasks</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search tasks..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) =>
          setFilter(value as "all" | "active" | "completed")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                dueDate={todo.dueDate}
                priority={todo.priority}
                onEdit={() => onEdit(todo.id)}
                onDelete={() => onDelete(todo.id)}
                onToggleComplete={(completed) =>
                  onToggleComplete(todo.id, completed)
                }
              />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No tasks found. Add a new task to get started!
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                dueDate={todo.dueDate}
                priority={todo.priority}
                onEdit={() => onEdit(todo.id)}
                onDelete={() => onDelete(todo.id)}
                onToggleComplete={(completed) =>
                  onToggleComplete(todo.id, completed)
                }
              />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No active tasks found.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                title={todo.title}
                description={todo.description}
                completed={todo.completed}
                dueDate={todo.dueDate}
                priority={todo.priority}
                onEdit={() => onEdit(todo.id)}
                onDelete={() => onDelete(todo.id)}
                onToggleComplete={(completed) =>
                  onToggleComplete(todo.id, completed)
                }
              />
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No completed tasks found.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoList;
