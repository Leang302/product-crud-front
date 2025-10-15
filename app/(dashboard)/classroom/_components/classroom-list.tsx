"use client"

import { useState, useEffect } from "react"
import type React from "react"
import type { Classroom } from "../_lib/types"
import { ClassroomCard } from "./classroom-card"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { listClassrooms } from "@/actions/classroomActions"
import { useRouter } from "next/navigation"

export function ClassroomList() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState<"all" | "Basic Course" | "Advance Course">("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadClassrooms()
  }, [])

  useEffect(() => {
    filterClassrooms()
  }, [searchQuery, courseFilter, classrooms])

  const loadClassrooms = async () => {
    setLoading(true)
    setError(null)
    try {
      const { items } = await listClassrooms({ page: 0, size: 50 })
      console.log("Raw API response items:", items)
      const colors = [
        "bg-pink-500",
        "bg-blue-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-orange-500",
      ]
      const mapped: Classroom[] = items.map((it) => {
        console.log("Mapping classroom item:", it)
        console.log("Available keys:", Object.keys(it))
        return {
          id: it.generationClassId,
          name: it.courseType,
          courseType: "Advance Course",
          instructor: "Mr. Doch",
          instructorId: "teacher1",
          studentCount: 0,
          groupCount: 0,
          generation: "",
          color: colors[Math.floor(Math.random() * colors.length)],
          icon: "📚",
        }
      })
      console.log("Mapped classrooms:", mapped)
      setClassrooms(mapped)
    } catch (error) {
      console.error("[hrd] Error loading classrooms:", error)
      // Check if it's an authentication error
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("Unauthorized"))) {
        setError("Session expired. Please log in again.")
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError("Failed to load classrooms. Please try again.")
      }
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
    console.log("Clicked classroom with ID:", classroomId)
    router.push(`/classroom/${classroomId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading classrooms...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
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
          <div key={classroom.id} className="relative">
            <ClassroomCard classroom={classroom} onClick={() => handleClassroomClick(classroom.id)} />
          </div>
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


