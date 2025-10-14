export type UserRole = "admin" | "teacher" | "student"

export interface User {
  id: string
  name: string
  role: UserRole
  email: string
}

export interface Classroom {
  id: string
  name: string
  courseType: "Basic Course" | "Advance Course"
  instructor: string
  instructorId: string
  studentCount: number
  groupCount: number
  generation: string
  color: string
  icon: string
}

export interface Task {
  id: string
  title: string
  classroomId: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  instructor: string
  type: "Exam" | "Subject" | "Presentation" | "Assignment"
  description: string
  isSeminar: boolean
}

export interface Group {
  id: string
  name: string
  classroomId: string
  studentIds: string[]
  students: Student[]
  subject: string
  teacher: string
}

export interface Student {
  id: string
  name: string
  email: string
}

export interface Resource {
  id: string
  title: string
  classroomId: string
  taskId?: string
  type: string
  url: string
  uploadedBy: string
  uploadedAt: Date
  fileSize?: string
}


