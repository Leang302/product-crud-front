"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Plus, MoreVertical, Calendar } from "lucide-react";
import { Button } from "./_components/ui/button";
import { Input } from "./_components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./_components/ui/dropdown-menu";
import { CreateTaskDialog } from "./_components/tasks/create-task-dialog";
import { EditTaskDialog } from "./_components/tasks/edit-task-dialog";
import { TaskDetailPage } from "./_components/tasks/task-detail-page";
import { cn } from "./_components//lib/utils";
import type { Task, CreateTaskFormData, User } from "./_components/lib/types";
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
} from "@/action/taskActions";
import { uploadFileAction } from "@/action/fileActions";
import { useRouter } from "next/navigation";

interface TaskManagementClientProps {
  initialTasks: Task[];
}

export default function TaskManagementClient({
  initialTasks,
}: TaskManagementClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "your">("all");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [user, setUser] = useState<User | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTask = async (data: CreateTaskFormData) => {
    try {
      setIsLoading(true);

      // Upload attachments first if any
      const uploadedLinks: { title: string; type: string; link: string }[] = [];
      if (data.attachments && data.attachments.length > 0) {
        for (const attachment of data.attachments) {
          if (attachment.file) {
            const formData = new FormData();
            formData.append("file", attachment.file);

            const uploadResult = await uploadFileAction(formData);
            if (uploadResult.success) {
              uploadedLinks.push({
                title: attachment.name,
                type: attachment.file.type,
                link:
                  uploadResult.data.payload?.url ||
                  uploadResult.data.payload?.link ||
                  "",
              });
            }
          }
        }
      }

      // Create FormData for server action
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("type", data.taskType);
      formData.append("status", "in-progress");
      formData.append("deadline", data.dueDate);
      formData.append("instructions", data.instructions || "");
      formData.append("submissionType", data.submissionType || "");
      formData.append("language", data.language || "");
      formData.append("startDate", data.startDate || "");
      formData.append("dueDate", data.dueDate);
      formData.append("subjects", data.subjects || "");

      // Add attachments as JSON string
      if (uploadedLinks.length > 0) {
        formData.append("attachments", JSON.stringify(uploadedLinks));
      }

      // Add class IDs
      data.classes.forEach((classId) => {
        formData.append("classIds", classId);
      });

      const result = await createTaskAction(formData);

      if (result.success) {
        // Refresh the page to get updated data
        router.refresh();
        setIsCreateOpen(false);
      } else {
        console.error("Failed to create task:", result.message);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("type", data.taskType || "");
      formData.append("status", data.status || "");
      formData.append("deadline", data.deadline || "");
      formData.append("instructions", data.instructions || "");
      formData.append("submissionType", data.submissionType || "");
      formData.append("language", data.language || "");
      formData.append("startDate", data.startDate || "");
      formData.append("dueDate", data.dueDate || "");
      formData.append("subjects", data.subjects || "");

      const result = await updateTaskAction(taskId, formData);

      if (result.success) {
        router.refresh();
        setIsEditOpen(false);
        setSelectedTask(null);
      } else {
        console.error("Failed to update task:", result.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);

      const result = await deleteTaskAction(taskId);

      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to delete task:", result.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const filteredTasks =
    activeTab === "your"
      ? tasks.filter((task) => task.teacher === session?.user?.name)
      : tasks;

  if (selectedTaskId) {
    return (
      <TaskDetailPage
        taskId={selectedTaskId}
        onBack={() => setSelectedTaskId(null)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
          >
            All Tasks
          </Button>
          <Button
            variant={activeTab === "your" ? "default" : "outline"}
            onClick={() => setActiveTab("your")}
          >
            Your Tasks
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search tasks..." className="w-64" />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600 text-sm">{task.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Teacher: {task.teacher}</span>
                  <span>Deadline: {task.deadline}</span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    )}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditTask(task)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateTask}
        isLoading={isLoading}
      />

      <EditTaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={selectedTask}
        onSubmit={(data) =>
          selectedTask && handleUpdateTask(selectedTask.id, data)
        }
        isLoading={isLoading}
      />
    </div>
  );
}
