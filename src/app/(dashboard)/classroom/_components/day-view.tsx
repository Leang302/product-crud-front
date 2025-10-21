"use client"

import type { Task } from "../_lib/types"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Video } from "lucide-react"
function formatDate(date: Date, opts: Intl.DateTimeFormatOptions) { return date.toLocaleDateString(undefined, opts) }

interface DayViewProps {
  tasks: Task[]
  date: Date
  onTaskClick: (task: Task) => void
}

const taskTypeColors: Record<string, string> = {
  Exam: "bg-red-100 text-red-700 border-red-200",
  Subject: "bg-blue-100 text-blue-700 border-blue-200",
  Presentation: "bg-purple-100 text-purple-700 border-purple-200",
  Assignment: "bg-green-100 text-green-700 border-green-200",
}

export function DayView({ tasks, date, onTaskClick }: DayViewProps) {
  const hours = Array.from({ length: 17 }, (_, i) => i + 7)

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{formatDate(date, { weekday: "long" })}</h2>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {hours.map((hour) => {
            const hourTasks = tasks.filter((task) => {
              const taskHour = Number.parseInt(task.startTime.split(":")[0])
              return taskHour === hour
            })

            return (
              <div key={hour} className="flex gap-4">
                <div className="w-20 flex-shrink-0">
                  <span className="text-sm text-gray-500">{hour.toString().padStart(2, "0")}:00</span>
                </div>
                <div className="flex-1 space-y-2">
                  {hourTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="w-full text-left p-4 rounded-lg border-2 hover:shadow-md transition-shadow bg-white"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{task.startTime}</span>
                          <span className="text-gray-500">{formatDate(new Date(task.date), { month: "long", day: "2-digit" })}</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{task.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.duration} min</span>
                        </div>
                        {task.isSeminar && (
                          <div className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            <span>Seminar</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={taskTypeColors[task.type]}>{task.type}</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


