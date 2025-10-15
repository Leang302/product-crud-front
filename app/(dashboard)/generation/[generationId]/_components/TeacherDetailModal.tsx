"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Teacher } from "@/types";

export default function TeacherDetailModal({ teacher, onClose, onEdit, onUpdateStatus }: { teacher: Teacher; onClose: () => void; onEdit: () => void; onUpdateStatus: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-[900px] p-8 overflow-y-auto max-h-[90vh]">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={onClose}>✕</button>
        <div className="grid grid-cols-[200px_1fr] gap-8">
          <div>
            <div className="h-[200px] w-[200px] rounded-xl bg-gray-200" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{teacher.firstName} {teacher.lastName}</h2>
              <Badge variant="secondary">Teacher</Badge>
              <Badge className={
                teacher.status === "active"
                  ? "bg-green-100 text-green-700"
                  : teacher.status === "graduated"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-700"
              }>
                {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-4">
          <InfoRow label="Full Name" value={`${teacher.firstName} ${teacher.lastName}`.trim()} />
          <InfoRow label="Email" value={teacher.email} />
          <InfoRow label="Phone Number" value={teacher.phone || "-"} />
          <InfoRow label="Gender" value={teacher.gender || "-"} />
          <InfoRow label="Place of Birth" value={teacher.placeOfBirth || "-"} />
          <InfoRow label="Date of Birth" value={teacher.dateOfBirth || "-"} />
          <InfoRow label="Departments" value={teacher.department} chips />
          <InfoRow label="Current Address" value={teacher.currentAddress || "-"} />
          <InfoRow label="Class" value={teacher.className || "-"} chips />
        </div>

        <div className="flex items-center gap-3 mt-8 justify-end">
          <Button variant="outline" onClick={onUpdateStatus}>Update Status</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onEdit}>Update Teacher</Button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, chips }: { label: string; value: string; chips?: boolean }) {
  return (
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      {chips ? (
        <div className="mt-1 flex gap-2">
          <Badge variant="secondary">{value}</Badge>
        </div>
      ) : (
        <div className="mt-1 text-gray-800">{value}</div>
      )}
    </div>
  );
}


