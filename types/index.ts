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

// Schemas
export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["admin", "teacher", "student"]),
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  status: z.string(),
  payload: z.object({
    token: z.string(),
    expiresIn: z.number(),
    refreshExpiresIn: z.number(),
    refreshToken: z.string(),
    tokenType: z.string(),
    idToken: z.string(),
    notBeforePolicy: z.number(),
    sessionState: z.string(),
    scope: z.string().nullable(),
  }),
  timestamps: z.string(),
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const SessionSchema = z.object({
  user: AuthUserSchema.nullable(),
  expires: z.string().optional(),
});
export type SessionResponse = z.infer<typeof SessionSchema>;

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
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
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

// Student types
export const StudentStatusSchema = z.enum(["active", "inactive", "graduated"]);
export type StudentStatus = z.infer<typeof StudentStatusSchema>;

export const StudentSchema = z.object({
  id: z.string(),
  generationId: z.string(),
  classId: z.string(),
  className: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  placeOfBirth: z.string().optional(),
  currentAddress: z.string().optional(),
  dateOfBirth: z.string().optional(),
  university: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  status: StudentStatusSchema.default("active"),
  avatar: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Student = z.infer<typeof StudentSchema>;

// Department types
export interface Department {
  id: string; // UUID from backend
  name: string;
  description?: string;
}

export type CreateDepartmentInput = { name: string; description?: string };
export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;
