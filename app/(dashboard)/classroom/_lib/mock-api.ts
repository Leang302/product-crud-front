import type { Classroom, Task, Group, Student, Resource } from "./types"

export const mockClassrooms: Classroom[] = [
  {
    id: "1",
    name: "Phnom Penh",
    courseType: "Advance Course",
    instructor: "Mr. Doch",
    instructorId: "teacher1",
    studentCount: 18,
    groupCount: 2,
    generation: "Gen 13th",
    color: "bg-pink-500",
    icon: "📚",
  },
  {
    id: "2",
    name: "Siem Reap",
    courseType: "Advance Course",
    instructor: "Mr. Doch",
    instructorId: "teacher1",
    studentCount: 18,
    groupCount: 2,
    generation: "Gen 13th",
    color: "bg-blue-500",
    icon: "📚",
  },
]

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "PP - Final Exam",
    classroomId: "1",
    date: new Date("2025-06-11"),
    startTime: "12:00",
    endTime: "15:00",
    duration: 180,
    instructor: "Keo Kim Leang",
    type: "Exam",
    description: "Comprehensive final examination covering all course topics",
    isSeminar: true,
  },
]

export const mockStudents: Student[] = [
  { id: "s1", name: "Sokha Chan", email: "sokha@example.com" },
  { id: "s2", name: "Dara Pov", email: "dara@example.com" },
]

export const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Group A",
    classroomId: "1",
    studentIds: ["s1", "s2"],
    students: [
      { id: "s1", name: "Sokha Chan", email: "sokha@example.com" },
      { id: "s2", name: "Dara Pov", email: "dara@example.com" },
    ],
    subject: "Web Development",
    teacher: "Mr. Doch",
  },
]

export const mockResources: Resource[] = []

export async function getClassrooms(role: string, userId?: string): Promise<Classroom[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return mockClassrooms
}

export async function getClassroomById(id: string): Promise<Classroom | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockClassrooms.find((c) => c.id === id) || null
}

export async function getTasks(classroomId: string): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockTasks.filter((t) => t.classroomId === classroomId)
}

export async function getGroups(classroomId: string): Promise<Group[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGroups.filter((g) => g.classroomId === classroomId)
}

export async function getGroupById(id: string): Promise<Group | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGroups.find((g) => g.id === id) || null
}

export async function createGroup(data: Partial<Group>): Promise<Group> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const newGroup: Group = {
    id: Date.now().toString(),
    name: data.name || "",
    classroomId: data.classroomId || "",
    studentIds: data.studentIds || [],
    students: data.students || [],
    subject: data.subject || "",
    teacher: data.teacher || "",
  }
  mockGroups.push(newGroup)
  return newGroup
}

export async function updateGroup(id: string, data: Partial<Group>): Promise<Group> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const idx = mockGroups.findIndex((g) => g.id === id)
  if (idx >= 0) {
    mockGroups[idx] = { ...mockGroups[idx], ...data }
    return mockGroups[idx]
  }
  throw new Error("Group not found")
}

export async function deleteGroup(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const idx = mockGroups.findIndex((g) => g.id === id)
  if (idx >= 0) {
    mockGroups.splice(idx, 1)
  }
}

export async function getStudents(): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockStudents
}

export async function getResources(taskId: string): Promise<Resource[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockResources.filter((r) => r.taskId === taskId)
}


