"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Classroom, Task, Group } from "../_lib/types"
import { getTasks, getGroups, createGroup } from "../_lib/mock-api"
import { getClassroomByIdApi } from "@/actions/classroomActions"
import { CalendarView } from "../_components/calendar-view"
import { DayView } from "../_components/day-view"
import { TaskDetailDialog } from "../_components/task-detail-dialog"
import { CreateGroupDialog } from "../_components/create-group-dialog"
import { Badge } from "@/app/(dashboard)/task/_components/ui/badge"
import { Button } from "@/app/(dashboard)/task/_components/ui/button"
import { ChevronLeft, Users, BookOpen, UsersRound, Plus, CheckSquare } from "lucide-react"
import { useAuth } from "../_lib/auth-context"

export default function ClassroomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { hasPermission } = useAuth()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [view, setView] = useState<"month" | "day">("month")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log("Loading classroom with ID:", params.id)
      const [classroomData, tasksData, groupsData] = await Promise.all([
        getClassroomByIdApi(params.id as string),
        getTasks(params.id as string),
        getGroups(params.id as string),
      ])
      console.log("Classroom data received:", classroomData)
      // Map API classroom to UI classroom shape
      setClassroom({
        id: classroomData.generationClassId,
        name: classroomData.courseType,
        courseType: "Advance Course",
        instructor: "Mr. Doch",
        instructorId: "teacher1",
        studentCount: 0,
        groupCount: 0,
        generation: "",
        color: "bg-blue-500",
        icon: "📚",
      })
      setTasks(tasksData)
      setGroups(groupsData)
    } catch (error) {
      console.error("Error loading classroom data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  const handleCreateGroup = () => {
    setIsCreateGroupOpen(true)
  }

  const handleSaveGroup = async (groupData: Partial<Group>) => {
    await createGroup(groupData)
    await loadData()
  }

  const handleGroupClick = (groupId: string) => {
    router.push(`/classroom/${params.id}/group/${groupId}`)
  }

  const filteredTasks = selectedTaskType ? tasks.filter((task) => task.type === selectedTaskType) : tasks

  const taskTypeCounts = {
    exam: tasks.filter((t) => t.type === "Exam").length,
    assignment: tasks.filter((t) => t.type === "Assignment").length,
    presentation: tasks.filter((t) => t.type === "Presentation").length,
    subject: tasks.filter((t) => t.type === "Subject").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading classroom...</div>
      </div>
    )
  }

  if (!classroom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Classroom not found</div>
      </div>
    )
  }

  const canCreateGroup = hasPermission("create")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/classroom") }>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Classrooms
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{classroom.name}</h1>
              <p className="text-gray-600">{classroom.generation}</p>
            </div>
            {canCreateGroup && (
              <Button onClick={handleCreateGroup} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            )}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{classroom.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{classroom.studentCount} Students</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4" />
              <span>{classroom.groupCount} Groups</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            onClick={() => setView("month")}
            className={view === "month" ? "bg-blue-600" : ""}
          >
            Month View
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            onClick={() => setView("day")}
            className={view === "day" ? "bg-blue-600" : ""}
          >
            Day View
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {view === "month" ? (
              <CalendarView tasks={filteredTasks} onTaskClick={handleTaskClick} />
            ) : (
              <DayView tasks={filteredTasks} date={selectedDate} onTaskClick={handleTaskClick} />
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Task Types</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTaskType(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTaskType === null ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <span className="font-medium text-gray-900">All Tasks</span>
                  <Badge variant="secondary" className="text-xs">
                    {tasks.length}
                  </Badge>
                </button>
                <button
                  onClick={() => setSelectedTaskType("Exam")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTaskType === "Exam" ? "bg-red-50 border-red-200" : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="font-medium text-gray-900">Exam</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {taskTypeCounts.exam}
                  </Badge>
                </button>
                <button
                  onClick={() => setSelectedTaskType("Assignment")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTaskType === "Assignment"
                      ? "bg-green-50 border-green-200"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-medium text-gray-900">Assignment</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {taskTypeCounts.assignment}
                  </Badge>
                </button>
                <button
                  onClick={() => setSelectedTaskType("Presentation")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTaskType === "Presentation"
                      ? "bg-purple-50 border-purple-200"
                      : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="font-medium text-gray-900">Presentation</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {taskTypeCounts.presentation}
                  </Badge>
                </button>
                <button
                  onClick={() => setSelectedTaskType("Subject")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    selectedTaskType === "Subject" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="font-medium text-gray-900">Subject</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {taskTypeCounts.subject}
                  </Badge>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <UsersRound className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Groups</h3>
              </div>
              <div className="space-y-2">
                {groups.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No groups yet</p>
                ) : (
                  groups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => handleGroupClick(group.id)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <UsersRound className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{group.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {group.students.length}
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <TaskDetailDialog
          open={isTaskDetailOpen}
          onOpenChange={setIsTaskDetailOpen}
          task={selectedTask}
          classroom={classroom}
          allTasks={tasks}
        />

        <CreateGroupDialog
          open={isCreateGroupOpen}
          onOpenChange={setIsCreateGroupOpen}
          classroomId={params.id as string}
          onSave={handleSaveGroup}
        />
      </div>
    </div>
  )
}


