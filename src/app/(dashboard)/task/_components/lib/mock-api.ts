import type { Task, CreateTaskFormData, User, TaskSubmission } from "./types"

// Mock current user - Change this to simulate different roles
let currentUser: User = {
  id: "1",
  name: "Kheng Sovannak",
  email: "teacher@example.com",
  role: "teacher", // Change to "admin" or "student" to test different permissions
}

// Mock API delay to simulate network requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock tasks database
let tasksDB: Task[] = [
  {
    id: "1",
    title: "Spring Data JPA Assignment",
    teacher: "Kheng Sovannak",
    deadline: "November 24, 2025",
    classes: [
      { id: "pp", name: "PP", code: "PP" },
      { id: "sr", name: "SR", code: "SR" },
    ],
    taskType: "class-session",
    status: "in-progress",
    instructions: `Please read the points below carefully and refer to the attached file for detailed guidance:
1. Create a Spring Boot project with Spring Data JPA and database driver.
2. Configure database in application.properties.
3. Define entity classes with @Entity and @Id.
4. Create a Repository interface extending JpaRepository.
5. Implement basic CRUD (Add, View, Update, Delete).`,
    submissionType: "individual",
    language: "Java",
    startDate: "2025-10-25",
    dueDate: "2025-11-24T23:59",
    assignedBy: "Kheng Sovannak",
    subjects: "Spring Basic",
    attachments: [
      {
        id: "1",
        name: "Project_Overview.pdf",
        size: 2.4,
        url: "/files/project_overview.pdf",
        uploadedSuccessfully: true,
      },
      {
        id: "2",
        name: "Project_Overview.pdf",
        size: 2.4,
        url: "/files/project_overview.pdf",
        uploadedSuccessfully: true,
      },
      {
        id: "3",
        name: "Project_Overview.pdf",
        size: 2.4,
        url: "/files/project_overview.pdf",
        uploadedSuccessfully: true,
      },
      {
        id: "4",
        name: "Project_Overview.pdf",
        size: 2.4,
        url: "/files/project_overview.pdf",
        uploadedSuccessfully: true,
      },
    ],
  },
  {
    id: "2",
    title: "Spring Data JPA Quiz",
    teacher: "Kheng Sovannak",
    deadline: "March 25, 2025",
    classes: [
      { id: "sr", name: "SR", code: "SR" },
      { id: "pp", name: "PP", code: "PP" },
      { id: "kps", name: "KPS", code: "KPS" },
    ],
    taskType: "presentation",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Spring Data JPA Quiz",
    teacher: "Kheng Sovannak",
    deadline: "March 25, 2025",
    classes: [{ id: "sr", name: "SR", code: "SR" }],
    taskType: "class-session",
    status: "completed",
  },
]

// Mock submissions database
const submissionsDB: TaskSubmission[] = []

// API Functions - Replace these with your actual API calls

export const api = {
  // Auth
  getCurrentUser: async (): Promise<User> => {
    await delay(300)
    return currentUser
  },

  setCurrentUser: (user: User) => {
    currentUser = user
  },

  // Tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(500)
    return [...tasksDB]
  },

  getTaskById: async (id: string): Promise<Task | null> => {
    await delay(300)
    return tasksDB.find((t) => t.id === id) || null
  },

  createTask: async (data: CreateTaskFormData): Promise<Task> => {
    await delay(500)
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      teacher: currentUser.name,
      deadline: new Date(data.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      classes: data.classes.map((id) => ({ id, name: id.toUpperCase(), code: id.toUpperCase() })),
      taskType: data.taskType,
      status: "in-progress",
      instructions: data.instructions,
      submissionType: data.submissionType,
      language: data.language,
      startDate: data.startDate,
      dueDate: data.dueDate,
      attachments: data.attachments,
      assignedBy: currentUser.name,
    }
    tasksDB = [newTask, ...tasksDB]
    return newTask
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task | null> => {
    await delay(500)
    const index = tasksDB.findIndex((t) => t.id === id)
    if (index === -1) return null
    tasksDB[index] = { ...tasksDB[index], ...data }
    return tasksDB[index]
  },

  deleteTask: async (id: string): Promise<boolean> => {
    await delay(500)
    const index = tasksDB.findIndex((t) => t.id === id)
    if (index === -1) return false
    tasksDB = tasksDB.filter((t) => t.id !== id)
    return true
  },

  // Submissions
  submitTask: async (taskId: string, attachments: File[]): Promise<TaskSubmission> => {
    await delay(1000)
    const submission: TaskSubmission = {
      id: Date.now().toString(),
      taskId,
      studentId: currentUser.id,
      studentName: currentUser.name,
      submittedAt: new Date().toISOString(),
      attachments: attachments.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size / 1024 / 1024, // Convert to MB
        uploadedSuccessfully: true,
      })),
      status: "submitted",
    }
    submissionsDB.push(submission)
    return submission
  },

  getSubmissionsByTask: async (taskId: string): Promise<TaskSubmission[]> => {
    await delay(300)
    return submissionsDB.filter((s) => s.taskId === taskId)
  },

  downloadResource: async (url: string): Promise<void> => {
    await delay(500)
    // Simulate download
    console.log("[v0] Downloading resource:", url)
    // In real implementation: window.open(url, '_blank')
  },
}

// Permission helpers
export const permissions = {
  canCreateTask: (user: User) => user.role === "teacher",
  canEditTask: (user: User) => user.role === "teacher",
  canDeleteTask: (user: User) => user.role === "teacher",
  canViewTask: (user: User) => true, // All roles can view
  canSubmitTask: (user: User, task: Task) => {
    return user.role === "student" && task.taskType !== "class-session"
  },
  canDownloadResource: (user: User, task: Task) => {
    return user.role === "student" && task.taskType === "class-session"
  },
}
