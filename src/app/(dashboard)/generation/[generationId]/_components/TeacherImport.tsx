"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ImportExcel({ onCancel, onFile, onSwitchTab }: { onCancel: () => void; onFile: (file: File) => void; onSwitchTab: (tab: "create" | "import" | "list") => void }) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>Back</Button>
          <h3 className="text-xl font-semibold">Create a New Teacher</h3>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-600"
            onClick={() => onSwitchTab("create")}
          >
            Manual Input
          </button>
          <button className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Import Excel</button>
        </div>
      </div>
      <div className="border-2 border-dashed rounded-xl p-10 text-center text-gray-500">
        <p className="mb-4">Drag and drop your files</p>
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button disabled={!file} onClick={() => file && onFile(file)}>Import Users</Button>
      </div>
    </div>
  );
}


