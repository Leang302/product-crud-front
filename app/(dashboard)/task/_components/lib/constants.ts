import { BookOpen, Users, Presentation, FileText } from "lucide-react"

export const TASK_TYPES = [
  {
    id: "examination",
    label: "Examination",
    description: "Create an exam with HRD integration",
    icon: BookOpen,
  },
  {
    id: "class-session",
    label: "Class Session",
    description: "Create an exam with HRD integration",
    icon: Users,
  },
  {
    id: "presentation",
    label: "Presentation",
    description: "Create an exam with HRD integration",
    icon: Presentation,
  },
  {
    id: "assignment",
    label: "Assignment",
    description: "Create an exam with HRD integration",
    icon: FileText,
  },
] as const

export const AVAILABLE_CLASSES = [
  { id: "pp", name: "PP", code: "PP" },
  { id: "sr", name: "SR", code: "SR" },
  { id: "kps", name: "KPS", code: "KPS" },
  { id: "btb", name: "BTB", code: "BTB" },
  { id: "pvh", name: "PVH", code: "PVH" },
] as const

export const LANGUAGES = ["Java", "Python", "JavaScript", "C++", "C#"] as const
