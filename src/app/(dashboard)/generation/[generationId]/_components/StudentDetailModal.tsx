"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Student } from "@/types";
import { X, Pencil } from "lucide-react";

interface StudentDetailModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function StudentDetailModal({
  student,
  isOpen,
  onClose,
  onEdit,
}: StudentDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <Card className="relative w-full max-w-2xl p-6 shadow-lg rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
            {student.firstName?.[0]}{student.lastName?.[0]}
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-gray-500">{student.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Generation ID</p>
            <p className="font-medium">{student.generationId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class ID</p>
            <p className="font-medium">{student.classId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Class Name</p>
            <p className="font-medium">{student.className || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{student.phone || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{student.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Place of Birth</p>
            <p className="font-medium">{student.placeOfBirth || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Address</p>
            <p className="font-medium">{student.currentAddress || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">{student.dateOfBirth || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">University</p>
            <p className="font-medium">{student.university || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Subjects</p>
            <div className="flex flex-wrap gap-2">
              {student.subjects?.length ? (
                student.subjects.map((s, i) => (
                  <Badge key={i} variant="secondary">{s}</Badge>
                ))
              ) : (
                <Badge variant="secondary">N/A</Badge>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge
              className={
                student.status === "active"
                  ? "bg-green-100 text-green-700"
                  : student.status === "graduated"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }
            >
              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" /> Edit Student
          </Button>
        </div>
      </Card>
    </div>
  );
}
