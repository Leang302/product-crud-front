"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Generations",
    value: "8",
    change: "+2",
    changeType: "positive" as const,
    icon: GraduationCap,
  },
  {
    title: "Total Classes",
    value: "45",
    change: "+5",
    changeType: "positive" as const,
    icon: BookOpen,
  },
  {
    title: "Completion Rate",
    value: "94%",
    change: "+3%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
];

const recentTasks = [
  {
    id: "1",
    title: "Spring Data JPA Quiz",
    teacher: "Kheng Sovannak",
    deadline: "March 25, 2025",
    status: "completed" as const,
  },
  {
    id: "2",
    title: "React Components Assignment",
    teacher: "Leng Hongmeng",
    deadline: "March 28, 2025",
    status: "in_progress" as const,
  },
  {
    id: "3",
    title: "Database Design Project",
    teacher: "Penh Seyha",
    deadline: "April 2, 2025",
    status: "pending" as const,
  },
];

const upcomingEvents = [
  {
    id: "1",
    title: "12th Generation Graduation",
    date: "March 30, 2025",
    type: "graduation" as const,
  },
  {
    id: "2",
    title: "Staff Meeting",
    date: "April 5, 2025",
    type: "meeting" as const,
  },
  {
    id: "3",
    title: "New Student Orientation",
    date: "April 10, 2025",
    type: "orientation" as const,
  },
];

export default function DashboardScreen() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Recent Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500">{task.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{task.deadline}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {task.status === "completed" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {task.status === "in_progress" && (
                        <Clock className="h-4 w-4 text-blue-500" />
                      )}
                      {task.status === "pending" && (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-xs text-gray-500 capitalize">
                        {task.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
