export type TaskType = "examination" | "class-session" | "presentation" | "assignment"

export type TaskStatus = "completed" | "in-progress"

export type SubmissionType = "individual" | "group"

export type UserRole = "admin" | "teacher" | "student"

export interface TaskClass {
  id: string
  name: string
  code: string
}

export interface TaskAttachment {
  id: string
  name: string
  size: number
  url?: string
  uploadProgress?: number
  uploadedSuccessfully?: boolean
}

export interface Task {
  id: string
  title: string
  teacher: string
  deadline: string
  classes: TaskClass[]
  taskType: TaskType
  status: TaskStatus
  instructions?: string
  submissionType?: SubmissionType
  language?: string
  startDate?: string
  dueDate?: string
  attachments?: TaskAttachment[]
  assignedBy?: string
  subjects?: string
}

export interface CreateTaskFormData {
  taskType: TaskType
  title: string
  instructions: string
  classes: string[]
  submissionType: SubmissionType
  language: string
  startDate: string
  dueDate: string
  attachments: TaskAttachment[]
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface TaskSubmission {
  id: string
  taskId: string
  studentId: string
  studentName: string
  submittedAt: string
  attachments: TaskAttachment[]
  status: "submitted" | "graded"
  grade?: number
}
