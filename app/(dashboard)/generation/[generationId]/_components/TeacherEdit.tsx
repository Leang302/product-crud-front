"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Teacher, TeacherStatus } from "@/types";

export default function EditTeacher({ teacher, onCancel, onSave }: { teacher: Teacher; onCancel: () => void; onSave: (updates: Partial<Teacher>) => void }) {
  const [fullName, setFullName] = useState(`${teacher.firstName} ${teacher.lastName}`.trim());
  const [email, setEmail] = useState(teacher.email || "");
  const [phone, setPhone] = useState(teacher.phone || "");
  const [placeOfBirth, setPlaceOfBirth] = useState(teacher.placeOfBirth || "");
  const [currentAddress, setCurrentAddress] = useState(teacher.currentAddress || "");
  const [dateOfBirth, setDateOfBirth] = useState(teacher.dateOfBirth || "");
  const [gender, setGender] = useState<"Male" | "Female">((teacher.gender as any) || "Male");
  const [status, setStatus] = useState<TeacherStatus>(teacher.status || "active");

  function splitName(name: string) {
    const s = String(name || "").replace(/[\u00A0\s]+/g, " ").trim();
    if (!s) return { firstName: "", lastName: "" };
    if (s.includes(",")) {
      const [last, first] = s.split(",").map((x) => x.trim());
      return { firstName: first || last || "", lastName: first ? last : "" };
    }
    const parts = s.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts.slice(0, -1).join(" "), lastName: parts[parts.length - 1] };
  }

  function handleUpdate() {
    const { firstName, lastName } = splitName(fullName);
    onSave({ firstName, lastName, email, phone, placeOfBirth, currentAddress, dateOfBirth, gender: gender as any, status });
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>Back</Button>
          <h3 className="text-xl font-semibold">Edit Teacher</h3>
        </div>
        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Manual Input</span>
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">Import Excel</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" value={fullName} onChange={setFullName} />
        <Input label="Email" value={email} onChange={setEmail} />
        <Input label="Phone Number" value={phone} onChange={setPhone} />
        <Input label="Current Address" value={currentAddress} onChange={setCurrentAddress} />
        <Input label="Place of Birth" value={placeOfBirth} onChange={setPlaceOfBirth} />
        <Input label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="text-sm text-gray-600">Gender</label>
          <div className="flex items-center gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={gender === "Male"} onChange={() => setGender("Male")} />
              Male
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={gender === "Female"} onChange={() => setGender("Female")} />
              Female
            </label>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-600">Status</label>
          <div className="flex items-center gap-6 mt-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={status === "active"} onChange={() => setStatus("active")} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={status === "inactive"} onChange={() => setStatus("inactive")} />
              In Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={status === "graduated"} onChange={() => setStatus("graduated")} />
              Graduated
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>Update</Button>
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


