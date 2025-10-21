"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Student, StudentStatus } from "@/types";

interface StudentEditProps {
  student: Student;
  onBack: () => void;
  onSave?: (updates: Partial<Student>) => void;
}

export default function EditStudent({ student, onBack, onSave }: StudentEditProps) {
  const [formData, setFormData] = useState({
    fullName: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
    email: student.email || "",
    phone: student.phone || "",
    university: student.university || "",
    placeOfBirth: student.placeOfBirth || "",
    dateOfBirth: student.dateOfBirth || "",
    gender: student.gender || "Male" as "Male" | "Female",
    status: student.status || "active" as StudentStatus,
  });

  useEffect(() => {
    setFormData({
      fullName: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
      email: student.email || "",
      phone: student.phone || "",
      university: student.university || "",
      placeOfBirth: student.placeOfBirth || "",
      dateOfBirth: student.dateOfBirth || "",
      gender: student.gender || "Male" as "Male" | "Female",
      status: student.status || "active" as StudentStatus,
    });
  }, [student]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Split full name into first and last name
    const names = formData.fullName.trim().split(/\s+/);
    const firstName = names[0] || "";
    const lastName = names.slice(1).join(" ") || "";

    const updates = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      university: formData.university,
      placeOfBirth: formData.placeOfBirth,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      status: formData.status,
    };

    // Call the onSave callback to actually update the student
    if (onSave) {
      onSave(updates);
    }
    
    onBack();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <h3 className="text-xl font-semibold">Edit Student: {student.firstName} {student.lastName}</h3>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Full Name" 
            value={formData.fullName} 
            onChange={(v) => handleChange("fullName", v)} 
          />
          <Input 
            label="Email" 
            value={formData.email} 
            onChange={(v) => handleChange("email", v)} 
          />
          <Input 
            label="Phone Number" 
            value={formData.phone} 
            onChange={(v) => handleChange("phone", v)} 
          />
          <SelectInput 
            label="University" 
            value={formData.university} 
            onChange={(v) => handleChange("university", v)}
            options={[
              "Royal University of Phnom Penh",
              "University of Cambodia", 
              "Angkor University",
              "University of Battambang",
              "Kampong Soam University"
            ]}
          />
          <Input 
            label="Place of Birth" 
            value={formData.placeOfBirth} 
            onChange={(v) => handleChange("placeOfBirth", v)} 
          />
          <Input 
            label="Date of Birth" 
            placeholder="dd/mm/yyyy" 
            value={formData.dateOfBirth} 
            onChange={(v) => handleChange("dateOfBirth", v)} 
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "Male"}
                  onChange={() => handleChange("gender", "Male")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                Male
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "Female"}
                  onChange={() => handleChange("gender", "Female")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                Female
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "active"}
                  onChange={() => handleChange("status", "active")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "inactive"}
                  onChange={() => handleChange("status", "inactive")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                Inactive
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "graduated"}
                  onChange={() => handleChange("status", "graduated")}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                Graduated
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={onBack}>Cancel</Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>Save Changes</Button>
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