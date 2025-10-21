"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "@/store";
import { MoreVertical, Users, Download } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import AssignClassHandlerModal from "../_components/AssignClassHandlerModal";
import AssignTeacherIntoClassModal from "../_components/AssignTeacherIntoClassModal";

export default function ClassesPage() {
  const params = useParams();
  const generationId = String(params?.generationId ?? "");
  const { students } = useStudentStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [assignHandlerModal, setAssignHandlerModal] = useState<{ isOpen: boolean; className: string }>({ isOpen: false, className: "" });
  const [assignTeacherModal, setAssignTeacherModal] = useState<{ isOpen: boolean; className: string }>({ isOpen: false, className: "" });

  function downloadClassTemplate() {
    const headers = [
      [
        "No",
        "Class Name",
        "Student Count",
        "Location",
        "Status",
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(headers.concat(new Array(5).fill(["", "", "", "", ""])));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classes");
    XLSX.writeFile(wb, "classes_template.xlsx");
  }

  return (
    <div 
      className="space-y-6 p-6"
      onClick={() => setOpenMenuId(null)}
    >
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">13th Generation</h2>
          <p className="text-sm text-gray-500 mt-1">Manage class's students</p>
        </div>
      </div>

      {/* Classes content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Classroom</h3>
          <Button variant="outline" onClick={downloadClassTemplate}>
            <Download className="w-4 h-4 mr-2" /> Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(["PP", "SR", "BTB", "KPS"] as string[]).map((name, idx) => {
            const classData = {
              "PP": { name: "Phnom Penh", count: students.filter(s => s.generationId === generationId && s.className === "PP").length },
              "SR": { name: "Siem Reap", count: students.filter(s => s.generationId === generationId && s.className === "SR").length },
              "BTB": { name: "Battambang", count: students.filter(s => s.generationId === generationId && s.className === "BTB").length },
              "KPS": { name: "Kampong Soam", count: students.filter(s => s.generationId === generationId && s.className === "KPS").length }
            }[name];
            
            if (!classData) return null;
            
            return (
              <div key={idx} className="relative">
                <button 
                  className="rounded-xl border py-5 text-left px-4 hover:border-blue-400 w-full"
                  onClick={() => {
                    // Navigate to students page with class filter
                    window.location.href = `/generation/${generationId}/students?class=${name.toLowerCase()}-1`;
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-blue-600 font-semibold">{classData.name}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{classData.count} students</span>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === name ? null : name);
                      }}
                      className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </button>

                {/* Popup Menu */}
                {openMenuId === name && (
                  <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border z-10 min-w-[200px]">
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setAssignHandlerModal({ isOpen: true, className: classData.name });
                        setOpenMenuId(null);
                      }}
                    >
                      Assign Class Handler
                    </button>
                    <button
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setAssignTeacherModal({ isOpen: true, className: classData.name });
                        setOpenMenuId(null);
                      }}
                    >
                      Assign Teacher into Class
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {assignHandlerModal.isOpen && (
        <AssignClassHandlerModal
          className={assignHandlerModal.className}
          onClose={() => setAssignHandlerModal({ isOpen: false, className: "" })}
          onAssign={(teacherId) => {
            console.log("Assigned teacher", teacherId, "as handler for", assignHandlerModal.className);
          }}
        />
      )}

      {assignTeacherModal.isOpen && (
        <AssignTeacherIntoClassModal
          className={assignTeacherModal.className}
          onClose={() => setAssignTeacherModal({ isOpen: false, className: "" })}
          onAssign={(teacherIds) => {
            console.log("Assigned teachers", teacherIds, "to", assignTeacherModal.className);
          }}
        />
      )}
    </div>
  );
}