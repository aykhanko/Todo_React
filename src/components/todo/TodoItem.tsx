import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MoreHorizontal, Edit, Trash, CheckCircle, Circle } from "lucide-react";

interface TodoItemProps {
  id?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string, completed: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id = "1",
  title = "Complete project documentation",
  description = "Write comprehensive documentation for the new feature implementation including API endpoints and usage examples.",
  dueDate = "2023-12-31",
  completed = false,
  priority = "medium",
  onEdit = () => {},
  onDelete = () => {},
  onToggleComplete = () => {},
}) => {
  const handleToggleComplete = () => {
    onToggleComplete(id, !completed);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  // Format the due date to be more readable
  const formattedDueDate = new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex items-center p-4 mb-2 border rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors">
      {/* Completion Status */}
      <div className="mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={handleToggleComplete} className="cursor-pointer">
                {completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{completed ? "Mark as incomplete" : "Mark as complete"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Todo Content */}
      <div className="flex-1">
        <div className="flex items-center">
          <h3
            className={`text-lg font-medium ${completed ? "line-through text-gray-400" : ""}`}
          >
            {title}
          </h3>
          <span
            className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor()}`}
          >
            {priority}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <span>Due: {formattedDueDate}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="ml-4 flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-500">
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TodoItem;
