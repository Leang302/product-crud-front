"use client"

import { AuthProvider } from "./_lib/auth-context"

export default function ClassroomLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}


