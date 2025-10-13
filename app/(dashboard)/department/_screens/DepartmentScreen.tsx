"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Building2,
  Users,
  Mail,
  Phone,
  MoreHorizontal,
} from "lucide-react";

const mockDepartments = [
  {
    id: "1",
    name: "Computer Science",
    head: "Dr. Kheng Sovannak",
    staff: 12,
    students: 150,
    email: "cs@hrd.edu",
    phone: "+855 12 345 678",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Information Technology",
    head: "Dr. Leng Hongmeng",
    staff: 8,
    students: 120,
    email: "it@hrd.edu",
    phone: "+855 12 345 679",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Software Engineering",
    head: "Dr. Penh Seyha",
    staff: 10,
    students: 100,
    email: "se@hrd.edu",
    phone: "+855 12 345 680",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Data Science",
    head: "Dr. Sokha Kim",
    staff: 6,
    students: 80,
    email: "ds@hrd.edu",
    phone: "+855 12 345 681",
    status: "inactive" as const,
  },
];

export default function DepartmentScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Department Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage departments and staff
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDepartments.map((department) => (
          <Card
            key={department.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{department.name}</CardTitle>
                    <p className="text-sm text-gray-500">{department.head}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Staff</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {department.staff}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span>Students</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {department.students}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{department.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{department.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    department.status === "active" ? "success" : "secondary"
                  }
                  className={
                    department.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {department.status}
                </Badge>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
