"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type Todo = {
  _id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  completed: boolean;
};

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchTodos() {
    const res = await fetch("/api/todos");
    if (!res.ok) return;
    const data = await res.json();
    setTodos(data);
  }

  useEffect(() => {
    void fetchTodos();
  }, []);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    });
    setTitle("");
    setLoading(false);
    fetchTodos();
  }

  async function updateStatus(id: string, nextStatus: string) {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
      headers: { "Content-Type": "application/json" },
    });
    fetchTodos();
  }

  async function toggleTodo(id: string, currentStatus: string) {
    const nextStatusMap: Record<string, string> = {
      pending: "completed",
      in_progress: "completed",
      completed: "pending",
    };
    const nextStatus = nextStatusMap[currentStatus] || "pending";
    await updateStatus(id, nextStatus);
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return "Pending";
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Todos</h1>

      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          placeholder="New todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          Add
        </Button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between rounded-md border p-4 shadow-sm"
          >
            <div className="flex flex-col gap-2 flex-1">
              <button
                type="button"
                className={`text-left text-lg font-medium transition-colors hover:text-primary ${todo.status === "completed" ? "line-through text-muted-foreground" : ""
                  }`}
                onClick={() => toggleTodo(todo._id, todo.status)}
              >
                {todo.title}
              </button>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={`text-xs px-2 py-1 rounded-md border transition-colors flex items-center gap-1 outline-hidden ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {getStatusLabel(todo.status)}
                      <ChevronDown className="size-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={() => updateStatus(todo._id, "pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => updateStatus(todo._id, "in_progress")}>
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => updateStatus(todo._id, "completed")}>
                      Completed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              type="button"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
