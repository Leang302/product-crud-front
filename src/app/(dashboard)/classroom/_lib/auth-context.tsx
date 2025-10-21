"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, UserRole } from "./types"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  hasPermission: (action: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUser: User = {
  id: "teacher1",
  name: "Mr. Doch",
  role: "admin",
  email: "teacher@school.com",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser)

  const hasPermission = (action: string): boolean => {
    if (!user) return false

    const permissions: Record<UserRole, string[]> = {
      admin: ["view", "create", "edit", "delete", "manage_all"],
      teacher: ["view", "create", "edit", "delete", "manage_own"],
      student: ["view"],
    }

    return permissions[user.role]?.includes(action) || false
  }

  return <AuthContext.Provider value={{ user, setUser, hasPermission }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


