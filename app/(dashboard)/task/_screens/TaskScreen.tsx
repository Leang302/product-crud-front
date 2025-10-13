"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskTable from "../_components/TaskTable";
import { Users, User, Plus } from "lucide-react";

const mockTasks = [
  {
    id: "1",
    title: "Spring Data JPA Quiz",
    teacher: "Kheng Sovannak",
    deadline: "March 25, 2025",
    class: "SR",
    additionalClasses: 3,
    taskType: "class_session" as const,
    status: "completed" as const,
  },
  {
    id: "2",
    title: "Spring Data JPA Quiz",
    teacher: "Leng Hongmeng",
    deadline: "March 25, 2025",
    class: "SR",
    additionalClasses: 0,
    taskType: "presentation" as const,
    status: "in_progress" as const,
  },
  {
    id: "3",
    title: "Spring Data JPA Quiz",
    teacher: "Penh Seyha",
    deadline: "March 25, 2025",
    class: "SR",
    additionalClasses: 0,
    taskType: "exam" as const,
    status: "completed" as const,
  },
];

export default function TaskScreen() {
  const [activeFilter, setActiveFilter] = useState<"all" | "your">("all");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Tasks</span>
            </button>
            <button
              onClick={() => setActiveFilter("your")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === "your"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Your Tasks</span>
            </button>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </div>

      <TaskTable rows={mockTasks} />
    </div>
  );
}
