"use client";

import { useState, useEffect } from "react";
import type React from "react";
import type { Classroom, Generation } from "../_lib/types";
import { ClassroomCard } from "./classroom-card";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import {
  getClassrooms,
  fetchGenerations,
  fetchGenerationClasses,
  convertGenerationClassToClassroom,
} from "@/app/(dashboard)/classroom/_lib/mock-api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function ClassroomList() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedGenerationId, setSelectedGenerationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<
    "all" | "Basic Course" | "Advance Course"
  >("all");
  const [loading, setLoading] = useState(true);
  const [generationsLoading, setGenerationsLoading] = useState(true);
  const [generationsError, setGenerationsError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    loadGenerations();
  }, []);

  useEffect(() => {
    if (selectedGenerationId) {
      loadClassrooms(selectedGenerationId);
    }
  }, [selectedGenerationId]);

  useEffect(() => {
    filterClassrooms();
  }, [searchQuery, courseFilter, classrooms]);

  const loadGenerations = async () => {
    setGenerationsLoading(true);
    try {
      // Get access token from session
      const accessToken = (session as any)?.accessToken;
      console.log("Session access token:", accessToken ? "present" : "missing");

      const data = await fetchGenerations();
      setGenerations(data);

      // Set the last created generation as default (assuming they're sorted by creation date)
      if (data.length > 0) {
        const lastGeneration = data[data.length - 1];
        setSelectedGenerationId(lastGeneration.id);
        console.log(`Auto-selected generation: ${lastGeneration.name}`);
      }
    } catch (error) {
      console.error("[hrd] Error loading generations:", error);
      // Show user-friendly error message
      setGenerations([]);
      setGenerationsError(
        error instanceof Error ? error.message : "Failed to load generations"
      );
    } finally {
      setGenerationsLoading(false);
    }
  };

  const loadClassrooms = async (generationId: string) => {
    setLoading(true);
    try {
      console.log(`Loading classrooms for generation: ${generationId}`);
      // Get access token from session
      const accessToken = (session as any)?.accessToken;
      console.log("Session access token:", accessToken ? "present" : "missing");

      const generationClasses = await fetchGenerationClasses(generationId);
      console.log("Raw generation classes from API:", generationClasses);

      const convertedClassrooms = generationClasses.map(
        convertGenerationClassToClassroom
      );
      console.log("Converted classrooms:", convertedClassrooms);

      setClassrooms(convertedClassrooms);
      console.log(`Loaded ${convertedClassrooms.length} classrooms`);
    } catch (error) {
      console.error("[hrd] Error loading classrooms:", error);
      throw error; // Let the error bubble up to show proper error UI
    } finally {
      setLoading(false);
    }
  };

  const filterClassrooms = () => {
    let filtered = classrooms;

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((c) => c.courseType === courseFilter);
    }

    setFilteredClassrooms(filtered);
  };

  const handleClassroomClick = (classroomId: string) => {
    router.push(`/classroom/${classroomId}`);
  };

  if (generationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-500">Loading generations...</div>
        </div>
      </div>
    );
  }

  if (generationsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <div className="text-gray-700 font-medium mb-2">
            Failed to load generations
          </div>
          <div className="text-gray-500 text-sm mb-4">{generationsError}</div>
          <Button
            onClick={() => {
              setGenerationsError(null);
              setGenerationsLoading(true);
              loadGenerations();
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Classes</h1>
            <p className="text-gray-500 mt-1">Manage your teaching classes</p>
          </div>
        </div>

        {/* Generation Filter Skeleton */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Generation:
            </label>
            <div className="relative">
              <select
                value={selectedGenerationId}
                onChange={(e) => setSelectedGenerationId(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={generationsLoading}
              >
                {generations.map((generation) => (
                  <option key={generation.id} value={generation.id}>
                    {generation.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-500">Loading classes...</div>
          </div>
        </div>
      </div>
    );
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
            className={
              courseFilter === "all" ? "text-gray-900" : "text-gray-500"
            }
            onClick={() => setCourseFilter("all")}
          >
            All Courses
          </Button>
          <Button
            variant={courseFilter === "Basic Course" ? "ghost" : "ghost"}
            className={
              courseFilter === "Basic Course"
                ? "text-gray-900"
                : "text-gray-500"
            }
            onClick={() => setCourseFilter("Basic Course")}
          >
            Basic Course
          </Button>
          <Button
            variant={courseFilter === "Advance Course" ? "secondary" : "ghost"}
            className={
              courseFilter === "Advance Course"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500"
            }
            onClick={() => setCourseFilter("Advance Course")}
          >
            Advance Course
          </Button>
        </div>
      </div>

      {/* Generation Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Generation:
          </label>
          <div className="relative">
            <select
              value={selectedGenerationId}
              onChange={(e) => setSelectedGenerationId(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {generations.map((generation) => (
                <option key={generation.id} value={generation.id}>
                  {generation.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            placeholder="Search here"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10 bg-white border border-gray-200 rounded-md h-10 w-full outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <Button variant="outline" size="icon" className="bg-white">
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClassrooms.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            classroom={classroom}
            onClick={() => handleClassroomClick(classroom.id)}
          />
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classrooms found</p>
        </div>
      )}
    </div>
  );
}
