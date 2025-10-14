"use client"

import { useState, useEffect } from "react"
import { Plus, MoreVertical, Calendar } from "lucide-react"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./_components/ui/dropdown-menu"
import { CreateTaskDialog } from "./_components/tasks/create-task-dialog"
import { EditTaskDialog } from "./_components/tasks/edit-task-dialog"
import { TaskDetailPage } from "./_components/tasks/task-detail-page"
import { cn } from "./_components//lib/utils"
import type { Task, CreateTaskFormData, User } from "./_components/lib/types"
import { api, permissions } from "./_components/lib/mock-api"

export default function TaskManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "your">("your")
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [tasksData, userData] = await Promise.all([api.getTasks(), api.getCurrentUser()])
      setTasks(tasksData)
      setUser(userData)
    } catch (error) {
      console.error("[v0] Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (data: CreateTaskFormData) => {
    try {
      const newTask = await api.createTask(data)
      setTasks([newTask, ...tasks])
    } catch (error) {
      console.error("[v0] Failed to create task:", error)
      alert("Failed to create task")
    }
  }

  const handleEditTask = async (data: Partial<Task>) => {
    if (!selectedTask) return
    try {
      const updatedTask = await api.updateTask(selectedTask.id, data)
      if (updatedTask) {
        setTasks(tasks.map((t) => (t.id === selectedTask.id ? updatedTask : t)))
      }
    } catch (error) {
      console.error("[v0] Failed to update task:", error)
      alert("Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      const success = await api.deleteTask(taskId)
      if (success) {
        setTasks(tasks.filter((t) => t.id !== taskId))
      }
    } catch (error) {
      console.error("[v0] Failed to delete task:", error)
      alert("Failed to delete task")
    }
  }

  const handleRowClick = (taskId: string) => {
    setSelectedTaskId(taskId)
  }

  const getTaskTypeIcon = (type: string) => {
    const icons = {
      "class-session": "📚",
      presentation: "📊",
      examination: "📝",
      assignment: "📋",
    }
    return icons[type as keyof typeof icons] || "📄"
  }

  const getTaskTypeLabel = (type: string) => {
    const labels = {
      "class-session": "Class Session",
      presentation: "Presentation",
      examination: "Exam",
      assignment: "Assignment",
    }
    return labels[type as keyof typeof labels] || type
  }

  if (selectedTaskId) {
    return <TaskDetailPage taskId={selectedTaskId} onBack={() => setSelectedTaskId(null)} />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen  bg-background">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-10xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Task Management</h1>
              <p className="text-sm text-muted-foreground">Manage tasks.</p>
            </div>
            {user && permissions.canCreateTask(user) && (
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-10xl px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "all" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Calendar className="h-4 w-4" />
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("your")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "your"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Calendar className="h-4 w-4" />
            Your Tasks
          </button>
          <div className="ml-auto">
            <Input placeholder="Search tasks..." className="w-64" />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Teacher</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Deadline</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Class</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Task Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b last:border-0 hover:bg-muted/30 cursor-pointer"
                  onClick={() => handleRowClick(task.id)}
                >
                  <td className="px-6 py-4 text-sm font-medium">{task.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.teacher}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{task.deadline}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">{task.classes[0]?.code}</span>
                      {task.classes.length > 1 && (
                        <span className="text-xs text-muted-foreground">+{task.classes.length - 1} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{getTaskTypeIcon(task.taskType)}</span>
                      <span>{getTaskTypeLabel(task.taskType)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                        task.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700",
                      )}
                    >
                      {task.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    {user && (permissions.canEditTask(user) || permissions.canDeleteTask(user)) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {permissions.canEditTask(user) && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedTask(task)
                                setIsEditOpen(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                          )}
                          {permissions.canDeleteTask(user) && (
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTask(task.id)} 
                              className="text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTaskDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={handleCreateTask} />
      <EditTaskDialog open={isEditOpen} onOpenChange={setIsEditOpen} task={selectedTask} onSubmit={handleEditTask} />
    </div>
  )
}
