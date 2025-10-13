"use client";

import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LogOut, User } from "lucide-react";

export default function UserMenu() {
  const { data } = useSession();
  const name = data?.user?.name || "User";
  const role = (data as any)?.role as string | undefined;
  return (
    <button
      className="flex items-center space-x-2"
      onClick={() => signOut({ callbackUrl: "/login" })}
      title={`${name}${role ? ` (${role})` : ""}`}
    >
      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
      <ChevronDown className="w-4 h-4 text-gray-500" />
      <span className="sr-only">Logout</span>
      <LogOut className="w-4 h-4 text-gray-500 ml-1" />
    </button>
  );
}
