"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UsersScreen() {
  const [role, setRole] = useState("all");
  const [gender, setGender] = useState("all");
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full md:w-auto">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search full name"
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">Import Excel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            This is a scaffold. Hook it to your API to list users, filter by
            role/gender, and provide actions like create/update/assign classes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
