"use client"

import { useState, useEffect } from "react"
import type { Task, Classroom, Resource } from "../_lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/(dashboard)/task/_components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarView } from "./calendar-view"
import { Clock, User, Video, Calendar, BookOpen, Users, GraduationCap, Download, FileText } from "lucide-react"
function formatDate(date: Date, opts: Intl.DateTimeFormatOptions) { return date.toLocaleDateString(undefined, opts) }
import { getResources } from "../_lib/mock-api"

interface TaskDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  classroom: Classroom | null
  allTasks: Task[]
}

const taskTypeColors: Record<string, string> = {
  Exam: "bg-red-100 text-red-700 border-red-200",
  Subject: "bg-blue-100 text-blue-700 border-blue-200",
  Presentation: "bg-purple-100 text-purple-700 border-purple-200",
  Assignment: "bg-green-100 text-green-700 border-green-200",
}

export function TaskDetailDialog({ open, onOpenChange, task, classroom, allTasks }: TaskDetailDialogProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [resources, setResources] = useState<Resource[]>([])
  const [loadingResources, setLoadingResources] = useState(false)

  useEffect(() => {
    if (open && task) {
      loadResources()
    }
  }, [open, task])

  const loadResources = async () => {
    if (!task) return
    setLoadingResources(true)
    try {
      const resourcesData = await getResources(task.id)
      setResources(resourcesData)
    } catch (error) {
      console.error("Error loading resources:", error)
    } finally {
      setLoadingResources(false)
    }
  }

  const handleDownload = (resource: Resource) => {
    const link = document.createElement("a")
    link.href = resource.url
    link.download = resource.title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!task || !classroom) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{task.title}</DialogTitle>
              <Badge className={taskTypeColors[task.type]}>{task.type}</Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Class Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Class Name</p>
                <p className="font-medium text-gray-900">{classroom.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course Type</p>
                <p className="font-medium text-gray-900">{classroom.courseType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Generation</p>
                <p className="font-medium text-gray-900">{classroom.generation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-medium text-gray-900">{classroom.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Students</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {classroom.studentCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Groups</p>
                <p className="font-medium text-gray-900 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {classroom.groupCount}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Task Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{formatDate(new Date(task.date), { month: "long", day: "2-digit", year: "numeric" })}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{task.startTime} - {task.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-medium text-gray-900">{task.instructor}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">{task.duration} minutes</p>
                </div>
              </div>
            </div>

            {task.isSeminar && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <Video className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">This is a seminar session</span>
              </div>
            )}

            {task.description && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900 leading-relaxed">{task.description}</p>
              </div>
            )}
          </div>

          {resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Resources
              </h3>
              <div className="space-y-2">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{resource.title}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{resource.type}</span>
                          {resource.fileSize && <span>{resource.fileSize}</span>}
                          <span>Uploaded by {resource.uploadedBy}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(resource)} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <Button variant="outline" onClick={() => setShowCalendar(!showCalendar)} className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              {showCalendar ? "Hide" : "Show"} Class Calendar
            </Button>

            {showCalendar && (
              <div className="mt-4">
                <CalendarView tasks={allTasks} onTaskClick={() => {}} />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


