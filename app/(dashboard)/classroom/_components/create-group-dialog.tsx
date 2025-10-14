"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/(dashboard)/task/_components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/app/(dashboard)/task/_components/ui/input"
import { Label } from "@/app/(dashboard)/task/_components/ui/label"
import { X, Plus, Users } from "lucide-react"
import { getStudents } from "../_lib/mock-api"
import type { Student, Group } from "../_lib/types"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classroomId: string
  onSave: (data: Partial<Group>) => Promise<void>
  editGroup?: Group | null
}

export function CreateGroupDialog({ open, onOpenChange, classroomId, onSave, editGroup }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const [availableStudents, setAvailableStudents] = useState<Student[]>([])
  const [showStudentList, setShowStudentList] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadStudents()
      if (editGroup) {
        setGroupName(editGroup.name)
        setSelectedStudents(editGroup.students)
      } else {
        setGroupName("")
        setSelectedStudents([])
      }
    }
  }, [open, editGroup])

  const loadStudents = async () => {
    const students = await getStudents()
    setAvailableStudents(students)
  }

  const handleAddStudent = (student: Student) => {
    if (!selectedStudents.find((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student])
    }
    setShowStudentList(false)
  }

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== studentId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSave({
        ...(editGroup && { id: editGroup.id }),
        name: groupName,
        classroomId,
        studentIds: selectedStudents.map((s) => s.id),
        students: selectedStudents,
      })
      setGroupName("")
      setSelectedStudents([])
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving group:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{editGroup ? "Edit Group" : "Create New Group"}</DialogTitle>
          <p className="text-sm text-gray-500">Fill in the group details and assign members</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-sm font-medium">
              Group name
            </Label>
            <Input
              id="groupName"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Assign member</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start text-gray-500 bg-transparent"
                onClick={() => setShowStudentList(!showStudentList)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add members
              </Button>

              {showStudentList && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {availableStudents.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => handleAddStudent(student)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedStudents.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{student.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStudent(student.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !groupName || selectedStudents.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (editGroup ? "Updating..." : "Creating...") : editGroup ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


