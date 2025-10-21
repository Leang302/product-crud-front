"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Search } from "lucide-react";

interface AssignTeacherIntoClassModalProps {
  className: string;
  onClose: () => void;
  onAssign: (teacherIds: string[]) => void;
}

export default function AssignTeacherIntoClassModal({
  className,
  onClose,
  onAssign,
}: AssignTeacherIntoClassModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  // Mock teachers data - replace with actual data from store
  const teachers = [
    {
      id: "t-1",
      name: "Kheng Sovannak",
      email: "sovannak.kheng0309@gmail.com",
      avatar: "",
    },
    {
      id: "t-2", 
      name: "Sophea Chan",
      email: "sopheachan@gmail.com",
      avatar: "",
    },
    {
      id: "t-3",
      name: "Ratanak Kim", 
      email: "ratanakkim@gmail.com",
      avatar: "",
    },
    {
      id: "t-4",
      name: "Sun Lyheng",
      email: "lyhengsun@gmail.com",
      avatar: "",
    },
  ];

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleAssign = () => {
    if (selectedTeachers.length > 0) {
      onAssign(selectedTeachers);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-[500px] max-h-[600px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Assign Teacher into {className} Class
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Select teachers to assign to this classroom.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search teacher by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Teachers List */}
          <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTeachers.includes(teacher.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => handleTeacherSelect(teacher.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                    {teacher.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{teacher.name}</div>
                    <div className="text-sm text-gray-500">{teacher.email}</div>
                  </div>
                  {selectedTeachers.includes(teacher.id) && (
                    <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Count */}
          {selectedTeachers.length > 0 && (
            <div className="mt-3 text-sm text-gray-600">
              {selectedTeachers.length} teacher{selectedTeachers.length > 1 ? 's' : ''} selected
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedTeachers.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Assign {selectedTeachers.length > 0 && `(${selectedTeachers.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
