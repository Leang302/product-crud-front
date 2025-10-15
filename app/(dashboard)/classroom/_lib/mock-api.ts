import type {
  Classroom,
  Task,
  Group,
  Student,
  Resource,
  Generation,
  GenerationClass,
} from "./types";

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
];

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
];

export const mockStudents: Student[] = [
  { id: "s1", name: "Sokha Chan", email: "sokha@example.com" },
  { id: "s2", name: "Dara Pov", email: "dara@example.com" },
];

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
];

export const mockResources: Resource[] = [];

// Mock generations for fallback
export const mockGenerations: Generation[] = [
  {
    id: "mock-gen-1",
    name: "13th Generation",
    description: "Mock generation for testing",
    isBasicCourseGraduated: false,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

export function getMockGenerations(): Generation[] {
  console.log("Using mock generations data");
  return mockGenerations;
}

export async function getClassrooms(
  role: string,
  userId?: string
): Promise<Classroom[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return mockClassrooms;
}

export async function getClassroomById(id: string): Promise<Classroom | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockClassrooms.find((c) => c.id === id) || null;
}

export async function getTasks(classroomId: string): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockTasks.filter((t) => t.classroomId === classroomId);
}

export async function getGroups(classroomId: string): Promise<Group[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockGroups.filter((g) => g.classroomId === classroomId);
}

export async function getGroupById(id: string): Promise<Group | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockGroups.find((g) => g.id === id) || null;
}

export async function createGroup(data: Partial<Group>): Promise<Group> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const newGroup: Group = {
    id: Date.now().toString(),
    name: data.name || "",
    classroomId: data.classroomId || "",
    studentIds: data.studentIds || [],
    students: data.students || [],
    subject: data.subject || "",
    teacher: data.teacher || "",
  };
  mockGroups.push(newGroup);
  return newGroup;
}

export async function updateGroup(
  id: string,
  data: Partial<Group>
): Promise<Group> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const idx = mockGroups.findIndex((g) => g.id === id);
  if (idx >= 0) {
    mockGroups[idx] = { ...mockGroups[idx], ...data };
    return mockGroups[idx];
  }
  throw new Error("Group not found");
}

export async function deleteGroup(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const idx = mockGroups.findIndex((g) => g.id === id);
  if (idx >= 0) {
    mockGroups.splice(idx, 1);
  }
}

export async function getStudents(): Promise<Student[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockStudents;
}

export async function getResources(taskId: string): Promise<Resource[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockResources.filter((r) => r.taskId === taskId);
}

// Real API functions - using Next.js API routes as proxies
const API_BASE_URL = "/api";
const REQUEST_TIMEOUT = 10000; // 10 seconds timeout

// Cache for generations to avoid repeated API calls
let generationsCache: Generation[] | null = null;
let generationsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to create fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

export async function fetchGenerations(): Promise<Generation[]> {
  // Check cache first
  const now = Date.now();
  if (generationsCache && now - generationsCacheTime < CACHE_DURATION) {
    console.log("Using cached generations");
    return generationsCache;
  }

  try {
    console.log("Fetching generations from API...");
    console.log(
      "API URL:",
      `${API_BASE_URL}/generations?page=1&size=10&sortBy=NAME&sortDirection=ASC`
    );

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/generations?page=1&size=10&sortBy=NAME&sortDirection=ASC`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to fetch generations: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("API Response data:", data);

    const generations = data.payload?.items || [];

    // Cache the result
    generationsCache = generations;
    generationsCacheTime = now;

    console.log(`Fetched ${generations.length} generations`);
    return generations;
  } catch (error) {
    console.error("Error fetching generations:", error);
    throw error;
  }
}

export async function fetchGenerationClasses(
  generationId: string
): Promise<GenerationClass[]> {
  try {
    console.log(`Fetching generation classes for ${generationId}`);
    console.log(
      "API URL:",
      `${API_BASE_URL}/generation-classes?generationId=${generationId}&page=0&size=10`
    );

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/generation-classes?generationId=${generationId}&page=0&size=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Failed to fetch generation classes: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log("API Response data:", data);
    const classes = data.payload?.items || [];

    console.log(`Fetched ${classes.length} generation classes`);
    return classes;
  } catch (error) {
    console.error("Error fetching generation classes:", error);
    throw error;
  }
}

// Convert GenerationClass to Classroom format for compatibility
export function convertGenerationClassToClassroom(
  generationClass: GenerationClass
): Classroom {
  console.log("Converting GenerationClass to Classroom:", {
    id: generationClass.generationClassId,
    name: generationClass.classroom.name,
    courseType: generationClass.courseType,
    generation: generationClass.generation.name,
  });

  return {
    id: generationClass.generationClassId,
    name: generationClass.classroom.name,
    courseType:
      generationClass.courseType === "BASIC"
        ? "Basic Course"
        : "Advance Course",
    instructor: "TBD", // This would need to be fetched from user data
    instructorId: generationClass.userId || "unknown",
    studentCount: 0, // This would need to be fetched separately
    groupCount: 0, // This would need to be fetched separately
    generation: generationClass.generation.name,
    color: getDeterministicColor(generationClass.generationClassId),
    icon: "📚",
  };
}

// Helper function to assign deterministic colors to classrooms based on ID
function getDeterministicColor(id: string): string {
  const colors = [
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  // Use the ID to generate a consistent color
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) & 0xffffffff;
  }
  return colors[Math.abs(hash) % colors.length];
}

// Helper function to assign random colors to classrooms
function getRandomColor(): string {
  const colors = [
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
