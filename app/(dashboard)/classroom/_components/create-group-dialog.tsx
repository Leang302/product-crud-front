"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/(dashboard)/task/_components/ui/button";
import { Input } from "@/app/(dashboard)/task/_components/ui/input";
import { Label } from "@/app/(dashboard)/task/_components/ui/label";
import { Checkbox } from "@/app/(dashboard)/task/_components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/(dashboard)/task/_components/ui/dialog";
import type { StudentResponse, CreateGroupRequest } from "../_lib/types";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generationClassId: string;
  onGroupCreated: () => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  generationClassId,
  onGroupCreated,
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [students, setStudents] = useState<StudentResponse[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Real API functions
  const fetchStudentsByClass = async (
    generationClassId: string
  ): Promise<StudentResponse[]> => {
    try {
      console.log(`Fetching students for class: ${generationClassId}`);
      const response = await fetch(
        `/api/users/students/class?genclassid=${generationClassId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch students: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      const students = data.payload?.items || data.payload || [];
      console.log(`Fetched ${students.length} students`);
      return students;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  };

  const createGroup = async (groupData: CreateGroupRequest): Promise<any> => {
    try {
      console.log("Creating group:", groupData);
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to create group: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Create group response data:", data);
      return data;
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  // Fetch students when dialog opens
  useEffect(() => {
    if (open && generationClassId) {
      loadStudents();
    }
  }, [open, generationClassId]);

  const loadStudents = async () => {
    setStudentsLoading(true);
    setError(null);
    try {
      const data = await fetchStudentsByClass(generationClassId);
      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load students"
      );
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    } else {
      setSelectedStudentIds(
        selectedStudentIds.filter((id) => id !== studentId)
      );
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (selectedStudentIds.length === 0) {
      setError("Please select at least one student");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const groupData: CreateGroupRequest = {
        groupName: groupName.trim(),
        generationClassId,
        userIds: selectedStudentIds,
      };

      await createGroup(groupData);

      // Reset form
      setGroupName("");
      setSelectedStudentIds([]);

      // Close dialog and refresh
      onOpenChange(false);
      onGroupCreated();
    } catch (error) {
      console.error("Error creating group:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create group"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSelectedStudentIds([]);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group and select students to add to it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Students</Label>
            {studentsLoading ? (
              <div className="text-sm text-gray-500">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-sm text-gray-500">No students available</div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudentIds.includes(student.id)}
                      onCheckedChange={(checked) =>
                        handleStudentToggle(student.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={student.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {student.name} ({student.email})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreateGroup} disabled={loading}>
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
