"use client"

import { useState } from "react"
import type { Task } from "../_lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

const taskTypeColors: Record<string, string> = {
  Exam: "bg-red-100 text-red-700",
  Subject: "bg-blue-100 text-blue-700",
  Presentation: "bg-purple-100 text-purple-700",
  Assignment: "bg-green-100 text-green-700",
}

function startOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth(), 1) }
function endOfMonth(date: Date) { return new Date(date.getFullYear(), date.getMonth() + 1, 0) }
function addMonths(date: Date, count: number) { return new Date(date.getFullYear(), date.getMonth() + count, date.getDate()) }
function subMonths(date: Date, count: number) { return addMonths(date, -count) }
function startOfWeek(date: Date) { // Monday as start
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  d.setHours(0,0,0,0)
  return d
}
function endOfWeek(date: Date) { const d = startOfWeek(date); d.setDate(d.getDate() + 6); d.setHours(23,59,59,999); return d }
function eachDayOfInterval(interval: { start: Date, end: Date }) {
  const days: Date[] = []
  const cur = new Date(interval.start)
  while (cur <= interval.end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
  return days
}
function isSameMonth(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate() }
function formatDate(date: Date, opts: Intl.DateTimeFormatOptions) { return date.toLocaleDateString(undefined, opts) }

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getTasksForDate = (date: Date) => tasks.filter((task) => isSameDay(new Date(task.date), date))

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(currentDate, { month: "long", day: "numeric" })} – {formatDate(addMonths(currentDate, 1), { month: "long", day: "numeric", year: "numeric" })}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day: string) => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <span className="text-xs font-semibold text-gray-600">{day}</span>
            </div>
          ))}

          {calendarDays.map((day: Date, index: number) => {
            const dayTasks = getTasksForDate(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isToday = isSameDay(day, new Date())
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <div
                key={index}
                className={`bg-white min-h-[100px] p-2 ${!isCurrentMonth ? "text-gray-400" : ""} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${isToday ? "bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center" : ""}`}>
                    {formatDate(day, { day: "numeric" })}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <button
                      key={task.id}
                      onClick={(e) => { e.stopPropagation(); onTaskClick(task) }}
                      className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate ${taskTypeColors[task.type]}`}
                    >
                      {task.startTime} {task.title}
                    </button>
                  ))}
                  {dayTasks.length > 2 && <div className="text-xs text-gray-500 px-2">+{dayTasks.length - 2} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}


