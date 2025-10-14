"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Upload, Download } from "lucide-react"
  import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { cn } from "../lib/utils"
import type { Task, User } from "../lib/types"
import { api, permissions } from "../lib/mock-api"

interface TaskDetailPageProps {
  taskId: string
  onBack: () => void
}

export function TaskDetailPage({ taskId, onBack }: TaskDetailPageProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [taskId])

  const loadData = async () => {
    const [taskData, userData] = await Promise.all([api.getTaskById(taskId), api.getCurrentUser()])
    setTask(taskData)
    setUser(userData)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async () => {
    if (!task || !selectedFiles.length) return
    setIsSubmitting(true)
    try {
      await api.submitTask(task.id, selectedFiles)
      alert("Task submitted successfully!")
      setIsSubmitDialogOpen(false)
      setSelectedFiles([])
    } catch (error) {
      alert("Failed to submit task")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = async (url: string) => {
    await api.downloadResource(url)
    alert("Download started!")
  }

  if (!task || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const canSubmit = permissions.canSubmitTask(user, task)
  const canDownload = permissions.canDownloadResource(user, task)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto max-w-9xl px-6 py-6">
          <button onClick={onBack} className="mb-4 flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Task Details</h1>
            <p className="text-sm text-muted-foreground">View and manage your task information</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-8xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card p-6">
              {/* Title and Status */}
              <div className="mb-6 flex items-start justify-between">
                <h2 className="text-3xl font-bold">{task.title}</h2>
                <span
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium",
                    task.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700",
                  )}
                >
                  {task.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>

              {/* Teacher */}
              <p className="mb-6 text-muted-foreground">{task.teacher}</p>

              {/* Classes */}
              <div className="mb-8 flex flex-wrap gap-2">
                {task.classes.map((cls) => (
                  <button
                    key={cls.id}
                    className={cn(
                      "rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors",
                      cls.code === "PP" || cls.code === "SR"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    {cls.code}
                  </button>
                ))}
              </div>

              {/* Instructions */}
              {task.instructions && (
                <div className="mb-8 rounded-lg border bg-muted/30 p-6">
                  <h3 className="mb-4 text-lg font-semibold">Instruction</h3>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{task.instructions}</div>
                </div>
              )}

              {/* Dates */}
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">Assigned Date</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">Start Date</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-sm text-muted-foreground">Due Date</div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Uploaded Files</h3>
                  {canSubmit && task.taskType !== "class-session" && (
                    <Button onClick={() => setIsSubmitDialogOpen(true)} size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit
                    </Button>
                  )}
                  {canDownload && task.attachments && task.attachments.length > 0 && (
                    <Button
                      onClick={() => task.attachments?.[0]?.url && handleDownload(task.attachments[0].url)}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Resources
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {task.attachments?.map((file) => (
                    <div key={file.id} className="flex flex-col items-center rounded-lg border bg-card p-4">
                      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                        <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                      </div>
                      <p className="mb-1 text-center text-sm font-medium">{file.name}</p>
                      <p className="mb-3 text-xs text-muted-foreground">{file.size} MB • PDF</p>
                      {canDownload && (
                        <Button onClick={() => file.url && handleDownload(file.url)} size="sm" variant="outline" className="w-full">
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Assigned By</p>
                  <p className="font-medium">{task.assignedBy || task.teacher}</p>
                </div>
              </div>

              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Submission Type</p>
                  <p className="font-medium capitalize">{task.submissionType || "Individual"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Subjects</p>
                  <p className="font-medium">{task.subjects || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Upload Files</label>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="w-full rounded-lg border p-2 text-sm"
              />
            </div>
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!selectedFiles.length || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
