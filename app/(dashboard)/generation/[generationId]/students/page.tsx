"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudentStore } from "@/store";
import { Student, StudentStatus } from "@/types";
import { Plus, Search, Filter, MoreVertical, Pencil } from "lucide-react";
import StudentCreate from "../_components/StudentCreate";
import StudentImport from "../_components/StudentImport";
import StudentEdit from "../_components/StudentEdit";
import StudentDetailModal from "../_components/StudentDetailModal";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function StudentsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const generationId = String(params?.generationId ?? "");
  const classFilter = searchParams.get("class");
  const { students, addStudent, updateStudent, deleteStudent } = useStudentStore();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<StudentStatus | "all">("all");
  const [filterGender, setFilterGender] = useState<'all' | 'Male' | 'Female'>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterUniversity, setFilterUniversity] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "create" | "import" | "edit">("list");
  const [selected, setSelected] = useState<Student | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Get class name from class ID
  const getClassName = (classId: string) => {
    const classMap: { [key: string]: string } = {
      "pp-1": "Phnom Penh",
      "sr-1": "Siem Reap", 
      "btb-1": "Battambang",
      "kps-1": "Kampong Soam"
    };
    return classMap[classId] || "Unknown";
  };

  const getClassCode = (classId: string) => {
    const classMap: { [key: string]: string } = {
      "pp-1": "PP",
      "sr-1": "SR", 
      "btb-1": "BTB",
      "kps-1": "KPS"
    };
    return classMap[classId] || "Unknown";
  };

  const currentStudents = useMemo(
    () => {
      let filtered = students.filter((s) => s.generationId === generationId);
      
      // If class filter is provided, filter by class
      if (classFilter) {
        const classCode = getClassCode(classFilter);
        filtered = filtered.filter((s) => s.className === classCode);
      }
      
      return filtered;
    },
    [students, generationId, classFilter]
  );

  // Get unique values for filters
  const uniqueSubjects = useMemo(() => {
    const subjects = currentStudents.flatMap(s => s.subjects || []).filter(Boolean);
    return Array.from(new Set(subjects)).sort();
  }, [currentStudents]);

  const uniqueUniversities = useMemo(() => {
    const universities = currentStudents.map(s => s.university).filter(Boolean);
    return Array.from(new Set(universities)).sort();
  }, [currentStudents]);

  const filtered = useMemo(() => {
    let filteredStudents = currentStudents;

    // Filter by status
    if (filterStatus !== "all") {
      filteredStudents = filteredStudents.filter((s) => s.status === filterStatus);
    }

    // Filter by gender
    if (filterGender !== "all") {
      filteredStudents = filteredStudents.filter((s) => s.gender === filterGender);
    }

    // Filter by subject
    if (filterSubject !== "all") {
      filteredStudents = filteredStudents.filter((s) => 
        s.subjects && s.subjects.some(subject => 
          subject.toLowerCase().includes(filterSubject.toLowerCase())
        )
      );
    }

    // Filter by university
    if (filterUniversity !== "all") {
      filteredStudents = filteredStudents.filter((s) => 
        s.university && s.university.toLowerCase().includes(filterUniversity.toLowerCase())
      );
    }

    // Filter by search query (full name only)
    if (query.trim()) {
      const q = query.toLowerCase();
      filteredStudents = filteredStudents.filter(
        (s) => `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
      );
    }

    return filteredStudents;
  }, [currentStudents, filterStatus, filterGender, filterSubject, filterUniversity, query]);

  function handleCreate(student: Student) {
    addStudent(student);
    setActiveTab("list");
  }

  function handleExcel(importedStudents: Student[]) {
    importedStudents.forEach((student) => {
      addStudent(student);
    });
    setActiveTab("list");
  }

  if (activeTab === "create") {
    return (
      <StudentCreate
        generationId={generationId}
        classId={classFilter || ""}
        className={getClassCode(classFilter || "")}
        onBack={() => setActiveTab("list")}
        onSubmit={handleCreate}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === "import") {
    return (
      <StudentImport
        generationId={generationId}
        classId={classFilter || ""}
        className={getClassCode(classFilter || "")}
        onCancel={() => setActiveTab("list")}
        onFile={handleExcel}
        onSwitchTab={(tab) => setActiveTab(tab)}
      />
    );
  }

  if (activeTab === "edit" && selected) {
    return (
      <StudentEdit
        student={selected}
        onBack={() => {
          setActiveTab("list");
          setSelected(null);
        }}
        onSave={(updates) => {
          updateStudent(selected.id, updates);
          setSelected((prev) => (prev ? { ...prev, ...updates } as Student : prev));
          setActiveTab("list");
        }}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top page tabs (Teachers / Classes) */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <Link href={`/generation/${generationId}/teachers`}>
          <button className="px-3 py-1 rounded-full text-gray-500 hover:text-gray-700">
            Teachers
          </button>
        </Link>
        <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          Classes
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {classFilter ? `${getClassName(classFilter)} Class` : "Student Management"}
          </h1>
          <p className="text-gray-600">
            {classFilter ? `View students` : `Manage students for Generation ${generationId}`}
          </p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setActiveTab("create")}
        >
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      {/* Search and Actions */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by full name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as StudentStatus | "all")}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as 'all' | 'Male' | 'Female')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  {uniqueSubjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* University Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                <select
                  value={filterUniversity}
                  onChange={(e) => setFilterUniversity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Universities</option>
                  {uniqueUniversities.map((university) => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterGender("all");
                    setFilterSubject("all");
                    setFilterUniversity("all");
                    setQuery("");
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="overflow-hidden border rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(filtered.map((s) => s.id));
                    } else {
                      setSelectedIds([]);
                    }
                  }}
                />
              </th>
              <th className="p-4">Student</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Class</th>
              <th className="p-4">Subjects</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(s.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedIds((prev) =>
                        checked ? [...prev, s.id] : prev.filter((id) => id !== s.id)
                      );
                    }}
                  />
                </td>
                <td className="p-4">
                  <button className="flex items-center gap-3 text-left w-full" onClick={() => setSelected(s)}>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">
                        {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{s.firstName} {s.lastName}</div>
                      <div className="text-sm text-gray-500">{s.email}</div>
                    </div>
                  </button>
                </td>
                <td className="p-4">{s.gender || "N/A"}</td>
                <td className="p-4">{s.className || "N/A"}</td>
                <td className="p-4">
                  {s.subjects?.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="mr-1">
                      {subject}
                    </Badge>
                  ))}
                </td>
                <td className="p-4">
                  <Badge
                    className={
                      s.status === "active"
                        ? "bg-green-100 text-green-700"
                        : s.status === "graduated"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <button
                    aria-label="Edit student"
                    className="p-2 rounded-md hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(s);
                      setActiveTab("edit");
                    }}
                  >
                    <Pencil className="w-4 h-4 text-blue-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && activeTab === "list" && (
        <StudentDetailModal
          student={selected}
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setActiveTab("edit");
          }}
        />
      )}
    </div>
  );
}