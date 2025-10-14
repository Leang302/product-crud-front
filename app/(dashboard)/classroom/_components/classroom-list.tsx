"use client"

import { useState, useEffect } from "react"
import type React from "react"
import type { Classroom } from "../_lib/types"
import { ClassroomCard } from "./classroom-card"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { getClassrooms } from "@/app/(dashboard)/classroom/_lib/mock-api"
import { useRouter } from "next/navigation"

export function ClassroomList() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState<"all" | "Basic Course" | "Advance Course">("all")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadClassrooms()
  }, [])

  useEffect(() => {
    filterClassrooms()
  }, [searchQuery, courseFilter, classrooms])

  const loadClassrooms = async () => {
    setLoading(true)
    try {
      const data = await getClassrooms("teacher", "t1")
      setClassrooms(data)
    } catch (error) {
      console.error("[hrd] Error loading classrooms:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterClassrooms = () => {
    let filtered = classrooms

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((c) => c.courseType === courseFilter)
    }

    setFilteredClassrooms(filtered)
  }

  const handleClassroomClick = (classroomId: string) => {
    router.push(`/classroom/${classroomId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading classrooms...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Classes</h1>
          <p className="text-gray-500 mt-1">Manage your teaching classes</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={courseFilter === "all" ? "ghost" : "ghost"}
            className={courseFilter === "all" ? "text-gray-900" : "text-gray-500"}
            onClick={() => setCourseFilter("all")}
          >
            All Courses
          </Button>
          <Button
            variant={courseFilter === "Basic Course" ? "ghost" : "ghost"}
            className={courseFilter === "Basic Course" ? "text-gray-900" : "text-gray-500"}
            onClick={() => setCourseFilter("Basic Course")}
          >
            Basic Course
          </Button>
          <Button
            variant={courseFilter === "Advance Course" ? "secondary" : "ghost"}
            className={courseFilter === "Advance Course" ? "bg-blue-50 text-blue-600" : "text-gray-500"}
            onClick={() => setCourseFilter("Advance Course")}
          >
            Advance Course
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            placeholder="Search here"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border border-gray-200 rounded-md h-10 w-full outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <Button variant="outline" size="icon" className="bg-white">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClassrooms.map((classroom) => (
          <ClassroomCard key={classroom.id} classroom={classroom} onClick={() => handleClassroomClick(classroom.id)} />
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classrooms found</p>
        </div>
      )}
    </div>
  )
}


