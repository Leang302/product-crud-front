"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Student, StudentStatus } from "@/types";
import { useStudentStore } from "@/store";
import { Trash2, ChevronDown, ChevronRight } from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function CreateStudent({
  generationId,
  classId,
  className,
  onBack,
  onSubmit,
  onSwitchTab,
}: {
  generationId: string;
  classId: string;
  className: string;
  onBack: () => void;
  onSubmit?: (student: Student) => void;
  onSwitchTab?: (tab: "create" | "import" | "list") => void;
}) {
  const [entries, setEntries] = useState([
    {
      id: 1,
      fullName: "",
      email: "",
      phone: "",
      placeOfBirth: "",
      dateOfBirth: "",
      university: "",
      gender: "Male" as "Male" | "Female",
      isExpanded: true,
    },
  ]);

  function splitName(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return { firstName: "", lastName: "" };
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    const lastName = parts.pop() as string;
    return { firstName: parts.join(" "), lastName };
  }

  function update(idx: number, patch: Partial<typeof entries[number]>) {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  }

  function addNewStudent() {
    const newId = Math.max(...entries.map(e => e.id)) + 1;
    setEntries([...entries, { 
      id: newId,
      fullName: "", 
      email: "", 
      phone: "", 
      placeOfBirth: "", 
      dateOfBirth: "", 
      university: "",
      gender: "Male",
      isExpanded: true
    }]);
  }

  function removeStudent(idx: number) {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== idx));
    }
  }

  function toggleExpanded(idx: number) {
    update(idx, { isExpanded: !entries[idx].isExpanded });
  }

  function handleCreate() {
    entries.forEach((e) => {
      const { firstName, lastName } = splitName(e.fullName);
      const student: Student = {
        id: generateId(),
        generationId,
        classId: classId || "N/A",
        className: className || "N/A",
        firstName,
        lastName,
        email: e.email,
        phone: e.phone,
        gender: e.gender as any,
        placeOfBirth: e.placeOfBirth,
        currentAddress: "",
        dateOfBirth: e.dateOfBirth,
        university: e.university,
        subjects: [],
        status: "active",
        avatar: "",
      };
      
      // Call the onSubmit callback to actually add the student
      if (onSubmit) {
        onSubmit(student);
      }
    });
    onBack();
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <h3 className="text-xl font-semibold">Create a New Student</h3>
        </div>
        <div className="flex gap-2 text-sm">
          <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Manual Input</button>
          <button 
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-600"
            onClick={() => onSwitchTab?.("import")}
          >
            Import Excel
          </button>
        </div>
      </div>

      {/* Student Sections */}
      <div className="space-y-4">
        {entries.map((e, idx) => (
          <div key={e.id} className="border rounded-xl p-4 mb-4">
            {/* Collapsible Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpanded(idx)}
            >
              <div className="flex items-center gap-3">
                {e.isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
                <span className="font-medium text-gray-900">Student {idx + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                {entries.length > 1 && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removeStudent(idx);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Content */}
            {e.isExpanded && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={e.fullName} onChange={(v) => update(idx, { fullName: v })} />
                  <Input label="Email" value={e.email} onChange={(v) => update(idx, { email: v })} />
                  <Input label="Phone Number" value={e.phone} onChange={(v) => update(idx, { phone: v })} />
                  <SelectInput 
                    label="University" 
                    value={e.university} 
                    onChange={(v) => update(idx, { university: v })}
                    options={[
                      "Royal University of Phnom Penh",
                      "University of Cambodia", 
                      "Angkor University",
                      "University of Battambang",
                      "Kampong Soam University"
                    ]}
                  />
                  <Input label="Place of Birth" value={e.placeOfBirth} onChange={(v) => update(idx, { placeOfBirth: v })} />
                  <Input label="Date of Birth" placeholder="dd/mm/yyyy" value={e.dateOfBirth} onChange={(v) => update(idx, { dateOfBirth: v })} />
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name={`gender-${idx}`}
                          checked={e.gender === "Male"}
                          onChange={() => update(idx, { gender: "Male" })}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="radio"
                          name={`gender-${idx}`}
                          checked={e.gender === "Female"}
                          onChange={() => update(idx, { gender: "Female" })}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Student Button */}
      <button
        className="text-blue-600 text-sm mt-2 hover:text-blue-700 font-medium"
        onClick={addNewStudent}
      >
        + Add new student
      </button>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreate}>Create</Button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <select
        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose university</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}