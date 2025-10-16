"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Plus, MoreVertical, Calendar } from "lucide-react"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./_components/ui/dropdown-menu"
import { CreateTaskDialog } from "./_components/tasks/create-task-dialog"
import { EditTaskDialog } from "./_components/tasks/edit-task-dialog"
import { TaskDetailPage } from "./_components/tasks/task-detail-page"
import { cn } from "./_components//lib/utils"
import type { Task, CreateTaskFormData, User } from "./_components/lib/types"

export default function TaskManagementPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"all" | "your">("all")
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
      const res = await fetch(
        "/api/tasks?page=1&size=10&sortBy=CREATED_AT&direction=DESC",
        { cache: "no-store" }
      )
      const data = await res.json()
      const items = (data?.payload?.items || data?.items || data) as any[]

      const mapped: Task[] = (Array.isArray(items) ? items : []).map((t: any) => ({
        id: String(t.id ?? t.taskId ?? crypto.randomUUID()),
        title: String(t.title ?? t.name ?? "Untitled"),
        teacher: String(
          t.teacherName ??
          t.teacher ??
          t.assignedBy?.name ??
          t.createdByName ??
          t.createdBy ??
          t.ownerName ??
          "-"
        ),
        deadline: String(t.deadline ?? t.dueDate ?? "-"),
        classes: Array.isArray(t.classes)
          ? t.classes.map((c: any) => ({ id: String(c.id ?? c.code ?? ""), name: String(c.name ?? c.code ?? ""), code: String(c.code ?? c.name ?? "") }))
          : Array.isArray(t.classIds)
            ? t.classIds.map((cid: any) => ({ id: String(cid), name: String(cid), code: String(cid) }))
            : [],
        taskType: ((): Task["taskType"] => {
          const v = String(t.type ?? t.taskType ?? "assignment")
          if (v === "class_session" || v === "class-session") return "class-session"
          if (v === "presentation") return "presentation"
          if (v === "examination" || v === "exam") return "examination"
          return "assignment"
        })(),
        status: ((): Task["status"] => {
          const s = String(t.status ?? "in_progress")
          if (s === "completed") return "completed"
          return "in-progress"
        })(),
        instructions: t.instructions ?? undefined,
        submissionType: t.submissionType ?? undefined,
        language: t.language ?? undefined,
        startDate: t.startDate ?? undefined,
        dueDate: t.dueDate ?? undefined,
        attachments: Array.isArray(t.attachments) ? t.attachments : [],
        assignedBy: t.assignedBy ?? undefined,
        subjects: t.subjects ?? undefined,
      }))

      setTasks(mapped)
    } catch (error) {
      console.error("[tasks] Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (data: CreateTaskFormData) => {
    try {
      // 1) Upload attachments (if any) to our proxy: /api/files/upload-file
      const uploadedLinks: { title: string; type: string; link: string }[] = []
      for (const att of data.attachments || []) {
        if (att.file) {
          const form = new FormData()
          form.append("file", att.file)
          const uploadRes = await fetch("/api/files/upload-file", { method: "POST", body: form })
          const text = await uploadRes.text()
          let parsed: any = undefined
          try { parsed = text ? JSON.parse(text) : undefined } catch {}
          const candidate = parsed || text
          const link = (
            candidate?.payload?.url ||
            candidate?.payload?.link ||
            candidate?.payload?.fileUrl ||
            candidate?.payload?.id ||
            candidate?.data?.url ||
            candidate?.url ||
            candidate
          )
          if (link) {
            uploadedLinks.push({ title: att.name, type: "LINK", link: String(link) })
          }
        }
      }

      // 2) Build task payload per upstream API
      const toIsoUtc = (d?: string) => (d ? new Date(d).toISOString() : undefined)
      const nowIso = new Date().toISOString()
      // Normalize task type to match backend enums
      const mapTaskType = (v?: string) => {
        const t = String(v || "class-session").toLowerCase()
        if (t === "class-session" || t === "class_session") return "CLASS_SESSION"
        if (t === "presentation") return "PRESENTATION"
        if (t === "assignment") return "ASSIGNMENT"
        // Fallback any unknown (e.g., examination/exam) to a safe default accepted by backend
        return "CLASS_SESSION"
      }

      const payload: any = {
        title: data.title,
        instructions: data.instructions ?? "",
        isIndividual: data.submissionType === "individual",
        taskType: mapTaskType(data.taskType),
        isRequired: true,
        deadline: toIsoUtc(data.dueDate) || nowIso,
        startDate: toIsoUtc(data.startDate) || nowIso,
        attachments: [],
      }

      if (uploadedLinks.length > 0) {
        payload.attachments = uploadedLinks.map((a) => ({
          title: a.title,
          type: "LINK",
          link: a.link,
          createdAt: nowIso,
          updatedAt: nowIso,
        }))
      }

      console.log("[create-task] payload", JSON.stringify(payload))
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        try {
          const errJson = text ? JSON.parse(text) : undefined
          const msg = errJson?.message || errJson?.error || text || "Create task failed"
          throw new Error(msg)
        } catch {
          throw new Error(text || "Create task failed")
        }
      }
      await loadData()
    } catch (error) {
      console.error("[tasks] Failed to create task:", error)
      alert((error as any)?.message || "Failed to create task")
    }
  }

  const handleEditTask = async (data: Partial<Task>) => {
    if (!selectedTask) return
    try {
      const toIsoUtc = (d?: string) => (d ? new Date(d).toISOString() : undefined)
      const nowIso = new Date().toISOString()
      const title = data.title ?? selectedTask.title
      const instructions = data.instructions ?? selectedTask.instructions ?? ""
      // Merge and upload attachments: keep existing links and append any new files
      const mergedAttachments: Array<{ title: string; type: string; link: string; createdAt: string; updatedAt: string }> = []
      const currentAttachments = Array.isArray(data.attachments)
        ? data.attachments
        : Array.isArray(selectedTask.attachments)
        ? selectedTask.attachments
        : []

      for (const att of currentAttachments as any[]) {
        if (att?.file instanceof File) {
          const form = new FormData()
          form.append("file", att.file)
          const uploadRes = await fetch("/api/files/upload-file", { method: "POST", body: form })
          const text = await uploadRes.text()
          let parsed: any = undefined
          try { parsed = text ? JSON.parse(text) : undefined } catch {}
          const candidate = parsed || text
          const link = (
            candidate?.payload?.url ||
            candidate?.payload?.link ||
            candidate?.payload?.fileUrl ||
            candidate?.payload?.id ||
            candidate?.data?.url ||
            candidate?.url ||
            candidate
          )
          if (link) {
            mergedAttachments.push({
              title: String(att?.name ?? att?.title ?? "Attachment"),
              type: "LINK",
              link: String(link),
              createdAt: nowIso,
              updatedAt: nowIso,
            })
          }
        } else {
          const existingLink = att?.link || att?.url
          if (existingLink) {
            mergedAttachments.push({
              title: String(att?.title ?? att?.name ?? "Attachment"),
              type: "LINK",
              link: String(existingLink),
              createdAt: String(att?.createdAt ?? nowIso),
              updatedAt: nowIso,
            })
          }
        }
      }
      const payload: any = {
        title,
        instructions,
        isIndividual: (data.submissionType ?? selectedTask.submissionType ?? "individual") === "individual",
        taskType:
          (data.taskType ?? selectedTask.taskType) === "class-session"
            ? "CLASS_SESSION"
            : String(data.taskType ?? selectedTask.taskType).toUpperCase(),
        isRequired: true,
        deadline: toIsoUtc((data as any).dueDate ?? selectedTask.dueDate) || nowIso,
        startDate: toIsoUtc((data as any).startDate ?? selectedTask.startDate) || nowIso,
        attachments: mergedAttachments,
      }

      const res = await fetch(`/api/tasks/${encodeURIComponent(selectedTask.id)}` ,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const text = await res.text()
        try {
          const errJson = text ? JSON.parse(text) : undefined
          const msg = errJson?.message || errJson?.error || text || "Update task failed"
          throw new Error(msg)
        } catch {
          throw new Error(text || "Update task failed")
        }
      }
      setIsEditOpen(false)
      await loadData()
    } catch (error) {
      console.error("[tasks] Failed to update task:", error)
      alert((error as any)?.message || "Failed to update task")
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    try {
      const res = await fetch(`/api/tasks/${encodeURIComponent(taskId)}`, { method: "DELETE" })
      if (!res.ok) {
        const text = await res.text()
        try {
          const errJson = text ? JSON.parse(text) : undefined
          const msg = errJson?.message || errJson?.error || text || "Delete task failed"
          throw new Error(msg)
        } catch {
          throw new Error(text || "Delete task failed")
        }
      }
      await loadData()
    } catch (error) {
      console.error("[tasks] Failed to delete task:", error)
      alert((error as any)?.message || "Failed to delete task")
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
            {(() => {
              const role = session?.user?.role as any
              const canCreate = role === "teacher" || role === "admin"
              return canCreate
            })() && (
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
          {/* Removed "Your Tasks" tab */}
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
                {/* Removed Class column to match backend */}
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
                  {/* Removed Class cell */}
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
                    {(() => {
                      const role = session?.user?.role as any
                      const canManage = role === "teacher" || role === "admin"
                      return canManage
                    })() && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(task)
                            setIsEditOpen(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Delete
                        </Button>
                      </div>
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
