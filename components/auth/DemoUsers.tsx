"use client";

import { StaticUsers } from "@/types";

export default function DemoUsers() {
  return (
    <div className="mt-6 text-xs text-gray-500">
      <p className="font-medium text-gray-700 mb-2">Demo Accounts</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(StaticUsers).map(([role, users]) => (
          <div key={role} className="rounded-md border p-3 bg-gray-50">
            <p className="mb-1 capitalize font-medium">{role}</p>
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <span>{u.email}</span>
                <span className="text-gray-400">{u.password}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
