"use client"

import type { Classroom } from "../_lib/types"
import { BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ClassroomCardProps {
  classroom: Classroom
  onClick: () => void
}

const colorClasses: Record<string, string> = {
  "bg-pink-500": "from-pink-400/20 to-pink-500/20",
  "bg-blue-500": "from-blue-400/20 to-blue-500/20",
  "bg-red-500": "from-red-400/20 to-red-500/20",
  "bg-purple-500": "from-purple-400/20 to-purple-500/20",
  "bg-green-500": "from-green-400/20 to-green-500/20",
  "bg-orange-500": "from-orange-400/20 to-orange-500/20",
}

export function ClassroomCard({ classroom, onClick }: ClassroomCardProps) {
  return (
    <Card
      className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-white"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${classroom.color} p-3 rounded-xl`}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <Badge variant="secondary" className="bg-pink-50 text-pink-600 border-0">
            {classroom.generation}
          </Badge>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-1">{classroom.name}</h3>
        <p className="text-sm text-gray-500 mb-6">{classroom.courseType}</p>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500 mb-1">Instructor</p>
            <p className="font-semibold text-gray-900">{classroom.instructor}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Student</p>
            <p className="font-semibold text-gray-900">{classroom.studentCount}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Group</p>
            <p className="font-semibold text-gray-900">{classroom.groupCount}</p>
          </div>
        </div>
      </div>

      {/* Decorative wave pattern */}
      <div
        className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[classroom.color]} rounded-tl-full opacity-50`}
      />
    </Card>
  )
}


