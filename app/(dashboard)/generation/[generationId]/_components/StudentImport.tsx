"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Student, StudentStatus } from "@/types";
import * as XLSX from "xlsx";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ImportExcel({ 
  generationId,
  classId,
  className,
  onCancel, 
  onFile, 
  onSwitchTab 
}: { 
  generationId: string;
  classId: string;
  className: string;
  onCancel: () => void; 
  onFile: (students: Student[]) => void; 
  onSwitchTab: (tab: "create" | "import" | "list") => void 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    } else {
      setFile(null);
    }
  };

  const handleImport = () => {
    if (!file) {
      setError("Please select an Excel file to import.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const importedStudents: Student[] = json
          .filter((row, index) => {
            // Skip empty rows
            const fullName = row["Full Name"] || row["Name"] || row["fullName"] || row["name"] || "";
            const email = row["Email"] || row["email"] || "";
            return fullName.trim() || email.trim();
          })
          .map((row, index) => {
            // Try multiple possible column names for full name
            const fullName = row["Full Name"] || row["Name"] || row["fullName"] || row["name"] || "";
            
            // Better name splitting logic
            let firstName = "";
            let lastName = "";
            
            if (fullName && fullName.trim()) {
              const names = fullName.trim().split(/\s+/);
              firstName = names[0] || "";
              lastName = names.slice(1).join(" ") || "";
            }
            
            // Fallback: try to get first and last name from separate columns
            if (!firstName && !lastName) {
              firstName = row["First Name"] || row["firstName"] || "";
              lastName = row["Last Name"] || row["lastName"] || "";
            }

            console.log(`Processing row ${index}:`, {
              fullName,
              firstName,
              lastName,
              email: row["Email"] || row["email"] || "",
              row: row
            });

            return {
              id: generateId(),
              generationId,
              classId: classId || "N/A",
              className: className || "N/A",
              firstName: firstName || `Student ${index + 1}`,
              lastName: lastName || "",
              email: row["Email"] || row["email"] || "",
              phone: row["Phone Number"] || row["Phone"] || row["phone"] || "",
              gender: (row["Gender"] || row["gender"] || "Male") as "Male" | "Female",
              placeOfBirth: row["Place of Birth"] || row["placeOfBirth"] || "",
              currentAddress: "",
              dateOfBirth: row["Date of Birth"] || row["dateOfBirth"] || "",
              university: row["University"] || row["university"] || "",
              subjects: [],
              status: "active" as StudentStatus,
              avatar: "",
            };
          });

        console.log(`Successfully imported ${importedStudents.length} students:`, importedStudents);
        
        if (importedStudents.length === 0) {
          setError("No valid student data found. Please check your Excel file format.");
          return;
        }

        onFile(importedStudents);
        onSwitchTab("list");
      } catch (err) {
        setError("Error parsing Excel file. Please ensure it's a valid format.");
        console.error("Excel import error:", err);
      }
    };
    reader.readAsBinaryString(file);
  };

  function downloadTemplate() {
    const headers = [
      [
        "Full Name",
        "Email",
        "Phone Number",
        "University",
        "Place of Birth",
        "Date of Birth",
        "Gender",
      ],
    ];
    
    // Add sample data
    const sampleData = [
      [
        "Hoeurn Somany",
        "hoeurnsomany@gmail.com",
        "076 4444 331",
        "University of Cambodia",
        "Memot, Kampong Cham",
        "15/05/1999",
        "Male",
      ],
      [
        "Sun Lyheng",
        "lyhengsun@gmail.com",
        "+855 12 345 678",
        "Royal University of Phnom Penh",
        "Phnom Penh",
        "01/01/2000",
        "Male",
      ],
      [
        "Sophea Chan",
        "sopheachan@gmail.com",
        "+855 98 765 432",
        "Royal University of Phnom Penh",
        "Phnom Penh",
        "20/03/2001",
        "Female",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet([...headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students_template.xlsx");
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel}>Back</Button>
          <h3 className="text-xl font-semibold">Create a New Student</h3>
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

      <div className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium">Import Students from Excel</h4>
            <p className="text-sm text-gray-600">Download the template and fill in your student data</p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
          <div className="space-y-4">
            <div className="text-gray-500">
              <p className="text-lg font-medium mb-2">Drag and drop your Excel file here</p>
              <p className="text-sm">or click to browse</p>
            </div>
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-sm text-green-600">Selected: {file.name}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">Excel Format Requirements:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the downloaded template as a guide</li>
            <li>• Required columns: Full Name, Email</li>
            <li>• Gender should be "Male" or "Female"</li>
            <li>• Date format: dd/mm/yyyy or any standard date format</li>
            <li>• All fields are optional except Full Name and Email</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button disabled={!file} onClick={handleImport}>Import Students</Button>
      </div>
    </div>
  );
}