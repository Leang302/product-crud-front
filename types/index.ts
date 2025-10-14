import { z } from "zod";

// User types
export const UserRoleSchema = z.enum(["admin", "teacher", "student"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: UserRoleSchema,
  avatar: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Task types
export const TaskTypeSchema = z.enum([
  "assignment",
  "exam",
  "presentation",
  "class_session",
]);
export type TaskType = z.infer<typeof TaskTypeSchema>;

export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed"]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  teacherId: z.string(),
  teacher: UserSchema.optional(),
  deadline: z.date(),
  classIds: z.array(z.string()),
  classes: z.array(z.string()).optional(),
  taskType: TaskTypeSchema,
  status: TaskStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Task = z.infer<typeof TaskSchema>;

// Generation types
export const GenerationSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
  image: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Generation = z.infer<typeof GenerationSchema>;

// Class types
export const ClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  generationId: z.string(),
  generation: GenerationSchema.optional(),
  teacherId: z.string(),
  teacher: UserSchema.optional(),
  studentIds: z.array(z.string()),
  students: z.array(UserSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Class = z.infer<typeof ClassSchema>;

// Auth types
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginForm = z.infer<typeof LoginSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

// Teacher types
export const TeacherStatusSchema = z.enum(["active", "inactive", "graduated"]);
export type TeacherStatus = z.infer<typeof TeacherStatusSchema>;

export const TeacherSchema = z.object({
  id: z.string(),
  generationId: z.string(),
  department: z.string(),
  className: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  placeOfBirth: z.string().optional(),
  currentAddress: z.string().optional(),
  dateOfBirth: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  status: TeacherStatusSchema.default("active"),
  avatar: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Teacher = z.infer<typeof TeacherSchema>;

// Static users for demo auth (email/password)
export const StaticUsers = {
  admin: [
    {
      id: "a1",
      email: "admin1@school.local",
      password: "admin123",
      firstName: "Alice",
      lastName: "Admin",
      role: "admin" as const,
    },
    {
      id: "a2",
      email: "admin2@school.local",
      password: "admin123",
      firstName: "Bob",
      lastName: "Admin",
      role: "admin" as const,
    },
    {
      id: "a3",
      email: "admin3@school.local",
      password: "admin123",
      firstName: "Cara",
      lastName: "Admin",
      role: "admin" as const,
    },
  ],
  teacher: [
    {
      id: "t1",
      email: "teacher1@school.local",
      password: "teacher123",
      firstName: "Tom",
      lastName: "Teacher",
      role: "teacher" as const,
    },
    {
      id: "t2",
      email: "teacher2@school.local",
      password: "teacher123",
      firstName: "Tina",
      lastName: "Teacher",
      role: "teacher" as const,
    },
    {
      id: "t3",
      email: "teacher3@school.local",
      password: "teacher123",
      firstName: "Tim",
      lastName: "Teacher",
      role: "teacher" as const,
    },
  ],
  student: [
    {
      id: "s1",
      email: "student1@school.local",
      password: "student123",
      firstName: "Sam",
      lastName: "Student",
      role: "student" as const,
    },
    {
      id: "s2",
      email: "student2@school.local",
      password: "student123",
      firstName: "Sara",
      lastName: "Student",
      role: "student" as const,
    },
    {
      id: "s3",
      email: "student3@school.local",
      password: "student123",
      firstName: "Sean",
      lastName: "Student",
      role: "student" as const,
    },
  ],
} as const;

// Department types
export interface Department {
  id: string; // UUID from backend
  name: string;
  description?: string;
}

export type CreateDepartmentInput = { name: string; description?: string };
export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;
