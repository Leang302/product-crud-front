"use client";

import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function DepartmentToolbar({
  deptTab,
  onChangeDept,
  onTemplate,
  onAdd,
}: {
  deptTab: "IT" | "Korean";
  onChangeDept: (dept: "IT" | "Korean") => void;
  onTemplate: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            deptTab === "IT" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => onChangeDept("IT")}
        >
          IT
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            deptTab === "Korean" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => onChangeDept("Korean")}
        >
          Korean
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onTemplate}>
          <Download className="w-4 h-4 mr-2" /> Template
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Teacher
        </Button>
      </div>
    </div>
  );
}


