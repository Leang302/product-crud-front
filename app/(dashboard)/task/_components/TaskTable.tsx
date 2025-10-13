"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Presentation,
  ClipboardList,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";

type Row = {
  id: string;
  title: string;
  teacher: string;
  deadline: string;
  class: string;
  additionalClasses: number;
  taskType: "class_session" | "presentation" | "exam" | "assignment";
  status: "completed" | "in_progress";
};

const getTaskTypeIcon = (type: Row["taskType"]) => {
  switch (type) {
    case "class_session":
      return <FileText className="w-4 h-4" />;
    case "presentation":
      return <Presentation className="w-4 h-4" />;
    case "exam":
      return <GraduationCap className="w-4 h-4" />;
    case "assignment":
      return <ClipboardList className="w-4 h-4" />;
  }
};

const getTaskTypeLabel = (type: Row["taskType"]) => {
  switch (type) {
    case "class_session":
      return "Class Session";
    case "presentation":
      return "Presentation";
    case "exam":
      return "Exam";
    case "assignment":
      return "Assignment";
  }
};

export default function TaskTable({ rows }: { rows: Row[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {task.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.teacher}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{task.deadline}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">
                        {task.class}
                      </span>
                      {task.additionalClasses > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{task.additionalClasses} more
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getTaskTypeIcon(task.taskType)}
                      <span className="text-sm text-gray-900">
                        {getTaskTypeLabel(task.taskType)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          task.status === "completed" ? "success" : "default"
                        }
                        className={
                          task.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {task.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
