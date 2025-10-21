"use client";

import { useState, useEffect } from "react";
import type React from "react";
import type { Classroom, Generation, GenerationClass } from "../_lib/types";
import { ClassroomCard } from "./classroom-card";
import { CreateGroupDialog } from "./create-group-dialog";
import { Button } from "@/app/(dashboard)/task/_components/ui/button";
import { Search, SlidersHorizontal, ChevronDown, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { extractRoleFromJWT } from "@/lib/jwt";
import { hasPermission } from "@/lib/permissions";
import type { UserRole } from "../_lib/types";

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
  const [createGroupDialogOpen, setCreateGroupDialogOpen] = useState(false);
  const [selectedClassroomForGroup, setSelectedClassroomForGroup] =
    useState<Classroom | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // Real API functions
  const fetchGenerations = async (): Promise<Generation[]> => {
    try {
      console.log("Fetching generations from API...");
      const response = await fetch(
        "/api/generations?page=1&size=10&sortBy=NAME&sortDirection=ASC",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch generations: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      const generations = data.payload?.items || [];
      console.log(`Fetched ${generations.length} generations`);
      return generations;
    } catch (error) {
      console.error("Error fetching generations:", error);
      throw error;
    }
  };

  const fetchGenerationClasses = async (
    generationId: string
  ): Promise<GenerationClass[]> => {
    try {
      console.log(`Fetching generation classes for ${generationId}`);
      const response = await fetch(
        `/api/generation-classes?generationId=${generationId}&page=0&size=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch generation classes: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      const classes = data.payload?.items || [];
      console.log(`Fetched ${classes.length} generation classes`);
      return classes;
    } catch (error) {
      console.error("Error fetching generation classes:", error);
      throw error;
    }
  };

  const convertGenerationClassToClassroom = (
    generationClass: GenerationClass
  ): Classroom => {
    console.log("Converting GenerationClass to Classroom:", {
      id: generationClass.generationClassId,
      name: generationClass.classroom.name,
      courseType: generationClass.courseType,
      generation: generationClass.generation.name,
    });

    return {
      id: generationClass.generationClassId,
      name: generationClass.classroom.name,
      courseType:
        generationClass.courseType === "BASIC"
          ? "Basic Course"
          : "Advance Course",
      instructor: "TBD",
      instructorId: generationClass.userId || "unknown",
      studentCount: 0,
      groupCount: 0,
      generation: generationClass.generation.name,
      color: getDeterministicColor(generationClass.generationClassId),
      icon: "📚",
    };
  };

  const getDeterministicColor = (id: string): string => {
    const colors = [
      "bg-pink-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) & 0xffffffff;
    }
    return colors[Math.abs(hash) % colors.length];
  };

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

  // Check if user is a teacher
  const accessToken = (session as any)?.accessToken;
  const userRole = accessToken
    ? (extractRoleFromJWT(accessToken) as UserRole)
    : undefined;
  const canCreateGroup = userRole === "teacher";
  const isAdmin = userRole === "admin";

  const handleCreateGroup = (classroom: Classroom) => {
    setSelectedClassroomForGroup(classroom);
    setCreateGroupDialogOpen(true);
  };

  const handleGroupCreated = () => {
    // Refresh the classroom data or show success message
    console.log("Group created successfully");
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
      {isAdmin && (
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
      )}

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
          <div key={classroom.id} className="relative group">
            <ClassroomCard
              classroom={classroom}
              onClick={() => handleClassroomClick(classroom.id)}
            />
            {canCreateGroup && (
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateGroup(classroom);
                }}
              >
                <Users className="w-4 h-4 mr-1" />
                Create Group
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Create Group Dialog */}
      {selectedClassroomForGroup && (
        <CreateGroupDialog
          open={createGroupDialogOpen}
          onOpenChange={setCreateGroupDialogOpen}
          generationClassId={selectedClassroomForGroup.id}
          onGroupCreated={handleGroupCreated}
        />
      )}

      {filteredClassrooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classrooms found</p>
        </div>
      )}
    </div>
  );
}
