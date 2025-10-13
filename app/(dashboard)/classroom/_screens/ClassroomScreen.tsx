"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Calendar, BookOpen, MoreHorizontal } from "lucide-react";

const mockClassrooms = [
  {
    id: "1",
    name: "Computer Science 101",
    teacher: "Kheng Sovannak",
    students: 25,
    schedule: "Mon, Wed, Fri 9:00 AM",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Web Development",
    teacher: "Leng Hongmeng",
    students: 20,
    schedule: "Tue, Thu 2:00 PM",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Database Design",
    teacher: "Penh Seyha",
    students: 18,
    schedule: "Mon, Wed 1:00 PM",
    status: "active" as const,
  },
  {
    id: "4",
    name: "Mobile Development",
    teacher: "Sokha Kim",
    students: 22,
    schedule: "Tue, Thu 10:00 AM",
    status: "inactive" as const,
  },
];

export default function ClassroomScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Classroom Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage classrooms and schedules
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Classroom
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClassrooms.map((classroom) => (
          <Card
            key={classroom.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{classroom.name}</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {classroom.teacher}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{classroom.students} students</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{classroom.schedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    classroom.status === "active" ? "success" : "secondary"
                  }
                  className={
                    classroom.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {classroom.status}
                </Badge>
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
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
