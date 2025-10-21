"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Users,
  Mail,
  Phone,
  GraduationCap,
  MoreHorizontal,
  Building2,
} from "lucide-react";

const mockStaff = [
  {
    id: "1",
    name: "Dr. Kheng Sovannak",
    role: "Professor",
    department: "Computer Science",
    email: "kheng.sovannak@hrd.edu",
    phone: "+855 12 345 678",
    avatar: "/api/placeholder/40/40",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Dr. Leng Hongmeng",
    role: "Associate Professor",
    department: "Information Technology",
    email: "leng.hongmeng@hrd.edu",
    phone: "+855 12 345 679",
    avatar: "/api/placeholder/40/40",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Dr. Penh Seyha",
    role: "Assistant Professor",
    department: "Software Engineering",
    email: "penh.seyha@hrd.edu",
    phone: "+855 12 345 680",
    avatar: "/api/placeholder/40/40",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Dr. Sokha Kim",
    role: "Lecturer",
    department: "Data Science",
    email: "sokha.kim@hrd.edu",
    phone: "+855 12 345 681",
    avatar: "/api/placeholder/40/40",
    status: "inactive" as const,
  },
];

export default function StaffScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage staff members and their information
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStaff.map((staff) => (
          <Card key={staff.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{staff.name}</CardTitle>
                    <p className="text-sm text-gray-500">{staff.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{staff.department}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{staff.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{staff.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={staff.status === "active" ? "success" : "secondary"}
                  className={
                    staff.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {staff.status}
                </Badge>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
