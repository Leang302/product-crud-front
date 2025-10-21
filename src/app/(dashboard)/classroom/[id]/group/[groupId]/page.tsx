"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getGroupById, getClassroomById, updateGroup, deleteGroup } from "../../../_lib/mock-api"
import type { Group, Classroom } from "../../../_lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, Users, BookOpen, Mail, User, Pencil, Trash2 } from "lucide-react"
import { CreateGroupDialog } from "../../../_components/create-group-dialog"
import { useAuth } from "../../../_lib/auth-context"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/app/(dashboard)/task/_components/ui/alert-dialog"

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [group, setGroup] = useState<Group | null>(null)
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    loadData()
  }, [params.groupId])

  const loadData = async () => {
    setLoading(true)
    try {
      const groupData = await getGroupById(params.groupId as string)
      if (groupData) {
        setGroup(groupData)
        const classroomData = await getClassroomById(groupData.classroomId)
        setClassroom(classroomData)
      }
    } catch (error) {
      console.error("Error loading group data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGroup = async (data: Partial<Group>) => {
    if (!group) return
    try {
      await updateGroup(group.id, data)
      await loadData()
    } catch (error) {
      console.error("Error updating group:", error)
    }
  }

  const handleDeleteGroup = async () => {
    if (!group) return
    try {
      await deleteGroup(group.id)
      router.push(`/classroom/${params.id}`)
    } catch (error) {
      console.error("Error deleting group:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading group...</div>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Group not found</div>
      </div>
    )
  }

  const isTeacher = user?.role === "teacher"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push(`/classroom/${params.id}`)}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Classroom
          </Button>

          {isTeacher && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(true)} className="gap-2">
                <Pencil className="w-4 h-4" />
                Edit Group
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete Group
              </Button>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{group.name}</h1>
          <p className="text-gray-600">{classroom?.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-semibold text-gray-900">{group.subject}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Teacher</p>
                <p className="font-semibold text-gray-900">{group.teacher}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="font-semibold text-gray-900">{group.students.length} Students</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.students.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail className="w-3 h-3" />
                    {student.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {isTeacher && (
        <CreateGroupDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          classroomId={group.classroomId}
          onSave={handleUpdateGroup}
          editGroup={group}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{group.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


