"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTeacherStore } from "@/store";
import { Teacher, TeacherStatus } from "@/types";
import { Plus, Upload, Filter, MoreVertical, Search, Pencil, Download } from "lucide-react";
import * as XLSX from "xlsx";
import CreateTeacher from "../_components/TeacherCreate";
import ImportExcel from "../_components/TeacherImport";
import EditTeacher from "../_components/TeacherEdit";
import TeacherDetailModal from "../_components/TeacherDetailModal";
import DepartmentToolbar from "../_components/DepartmentToolbar";
import SearchBarActions from "../_components/SearchBarActions";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function TeachersPage() {
  const params = useParams();
  const generationId = String(params?.generationId ?? "");
  const { teachers, addTeacher, updateTeacher, deleteTeacher, importTeachers } =
    useTeacherStore();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<TeacherStatus | "all">("all");
  const [filterGender, setFilterGender] = useState<'all' | 'Male' | 'Female'>("all");
  const [activeTab, setActiveTab] = useState<"list" | "create" | "import" | "edit">(
    "list"
  );
  const [deptTab, setDeptTab] = useState<"IT" | "Korean">("IT");
  const [mainTab, setMainTab] = useState<"teachers" | "classes">("teachers");
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TeacherStatus>("active");
  function downloadTemplate() {
    const headers = [
      [
        "No",
        "Name",
        "Gender",
        "Date of birth",
        "Place of Birth",
        "Phone",
        "Email",
        "Address",
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(headers.concat(new Array(5).fill(["", "", "", "", "", "", "", ""])));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, "teachers_template.xlsx");
  }

  const currentTeachers = useMemo(
    () => teachers.filter((t) => t.generationId === generationId),
    [teachers, generationId]
  );

  const filtered = useMemo(() => {
    const byStatus =
      filterStatus === "all"
        ? currentTeachers
        : currentTeachers.filter((t) => t.status === filterStatus);
    const byGender = filterGender === 'all' ? byStatus : byStatus.filter((t) => (t.gender as any) === filterGender);
    const byDept = byGender.filter((t) => (t.department || "IT") === deptTab);
    if (!query.trim()) return byDept;
    const q = query.toLowerCase();
    return byDept.filter(
      (t) =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [currentTeachers, filterStatus, filterGender, query, deptTab]);

  function handleCreate(form: Partial<Teacher>) {
    const teacher: Teacher = {
      id: generateId(),
      generationId,
      department: form.department || deptTab,
      className: form.className || "N/A",
      firstName: form.firstName || "",
      lastName: form.lastName || "",
      email: form.email || "",
      phone: form.phone,
      gender: form.gender as any,
      placeOfBirth: form.placeOfBirth,
      currentAddress: form.currentAddress,
      dateOfBirth: form.dateOfBirth,
      subjects: form.subjects || [],
      status: (form.status as TeacherStatus) || "active",
      avatar: form.avatar,
    };
    addTeacher(teacher);
    setActiveTab("list");
  }

  function handleExcel(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        if (!wb.SheetNames.length) {
          alert("No sheets found in the workbook.");
          return;
        }

        let aggregated: Teacher[] = [];
        for (const sheetName of wb.SheetNames) {
          const ws = wb.Sheets[sheetName];
          if (!ws) continue;
          const rows = extractObjectsWithDetectedHeader(ws);
          if (!rows.length) continue;

          const alias = createHeaderAlias(Object.keys(rows[0]));
          if (!alias.email && !alias.fullName && !alias.firstName) {
            // This sheet doesn't look like a teachers sheet; skip
            continue;
          }

          const imported: Teacher[] = rows.map((r) => {
            const split = splitFullName(r[alias.fullName] || r[alias.firstName] || "");
            return {
              id: generateId(),
              generationId,
              department: r[alias.department] || deptTab,
              className: r[alias.class] || "N/A",
              firstName: split.firstName || r[alias.firstName] || "",
              lastName: split.lastName || r[alias.lastName] || "",
              email: r[alias.email] || "",
              phone: r[alias.phone],
              gender: r[alias.gender],
              placeOfBirth: r[alias.placeOfBirth],
              currentAddress: r[alias.currentAddress],
              dateOfBirth: r[alias.dateOfBirth],
              subjects: (r[alias.subjects]
                ? String(r[alias.subjects]).split(",")
                : []
              ).map((s) => s.trim()),
              status: normalizeStatus(r[alias.status]) as TeacherStatus,
              avatar: r[alias.avatar],
            };
          });
          // Keep rows even if email is missing; we rely on Full Name split
          aggregated = aggregated.concat(imported);
        }

        if (!aggregated.length) {
          alert("No teacher rows found. Please check your column headers.");
          return;
        }

        importTeachers(aggregated);
        setActiveTab("list");
      } catch (err) {
        console.error("Import failed", err);
        alert("Import failed. Please verify the file format and columns.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function normalize(h: string) {
    return String(h || "").toLowerCase().replace(/[^a-z0-9]+/g, "").trim();
  }

  function splitFullName(name: any) {
    const s = String(name || "").replace(/[\u00A0\s]+/g, " ").trim();
    if (!s) return { firstName: "", lastName: "" };
    // Case: "Last, First"
    if (s.includes(",")) {
      const [last, first] = s.split(",").map((x) => x.trim()).filter(Boolean);
      return { firstName: first || last || "", lastName: first ? last : "" };
    }
    const parts = s.split(/\s+/);
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    const last = parts[parts.length - 1];
    const first = parts.slice(0, -1).join(" ");
    return { firstName: first, lastName: last };
  }

  function createHeaderAlias(headers: string[]) {
    const hset = new Map(headers.map((h) => [normalize(h), h]));
    const pick = (...cands: string[]) => {
      for (const c of cands) {
        const key = normalize(c);
        if (hset.has(key)) return hset.get(key) as string;
        // try startsWith fallback
        for (const k of hset.keys()) {
          if (k.startsWith(key)) return hset.get(k as any) as string;
        }
      }
      return "";
    };
    // Prefer the provided headers: Name, Gender, Date of birth, Place of Birth, Phone, Email, Address
    return {
      fullName: pick("Name", "Full Name", "Teacher Name"),
      firstName: pick("First Name", "Given Name"),
      lastName: pick("Last Name", "Surname"),
      email: pick("Email", "Email Address"),
      phone: pick("Phone", "Phone Number", "Contact"),
      gender: pick("Gender", "Sex"),
      placeOfBirth: pick("Place of Birth", "Birth Place", "POB"),
      currentAddress: pick("Address", "Current Address"),
      dateOfBirth: pick("Date of birth", "Date of Birth", "DOB", "Birth Date"),
      department: pick("Department", "Dept"),
      class: pick("Class", "Class Name"),
      subjects: pick("Subjects", "Subject"),
      status: pick("Status"),
      avatar: pick("Avatar", "Image", "Photo"),
    } as Record<string, string>;
  }

  function normalizeStatus(val: any): TeacherStatus {
    const s = String(val || "").toLowerCase();
    if (s.startsWith("grad")) return "graduated";
    if (s.startsWith("inact")) return "inactive";
    return "active";
  }

  function extractObjectsWithDetectedHeader(ws: XLSX.WorkSheet): Record<string, any>[] {
    // Robust table detector: scans the sheet for a row that looks like the header
    // and builds objects from that region only (ignoring titles/logos above).
    const expected = new Set(["name", "gender", "dateofbirth", "placeofbirth", "phone", "email", "address"]);
    const norm = (v: any) => String(v || "").toLowerCase().replace(/[^a-z0-9]+/g, "");

    const rangeRef = ws["!ref"];
    if (!rangeRef) return [];
    const range = XLSX.utils.decode_range(rangeRef);

    let headerRowIdx = -1;
    let header: string[] = [];
    for (let r = range.s.r; r <= range.e.r; r++) {
      const rowVals: string[] = [];
      let matches = 0;
      for (let c = range.s.c; c <= range.e.c; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        const cell = ws[cellAddress];
        const v = cell ? String(cell.v ?? "") : "";
        rowVals.push(v);
        if (expected.has(norm(v))) matches++;
      }
      if (matches >= 3) {
        headerRowIdx = r;
        header = rowVals;
        break;
      }
    }
    if (headerRowIdx === -1) return [];

    // Build rows beneath header until a block of empty lines ends the table
    const out: Record<string, any>[] = [];
    let emptyStreak = 0;

    // Map important columns for row-shape detection
    const idx = (label: string) => header.findIndex((h) => norm(h) === norm(label));
    const nameIdx = idx("Name");
    const emailIdx = idx("Email");
    const phoneIdx = idx("Phone");

    for (let r = headerRowIdx + 1; r <= range.e.r; r++) {
      const obj: Record<string, any> = {};
      let nonEmpty = 0;
      const rowTextParts: string[] = [];
      for (let c = range.s.c; c <= range.e.c; c++) {
        const keyRaw = header[c - range.s.c] || `col_${c}`;
        const key = keyRaw.trim();
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        const cell = ws[cellAddress];
        const v = cell ? cell.v : "";
        const s = String(v ?? "").trim();
        if (s) nonEmpty++;
        obj[key] = v ?? "";
        rowTextParts.push(s.toLowerCase());
      }

      const firstCell = rowTextParts[0] || "";
      const joined = rowTextParts.join(" ");

      // Heuristics to stop at footer/notes under the table
      const looksLikeNote = firstCell.startsWith("note") || joined.includes("deputy director") || joined.includes("date:");
      const namePresent = nameIdx >= 0 && !!rowTextParts[nameIdx];
      const emailPresent = emailIdx >= 0 && !!rowTextParts[emailIdx];
      const phonePresent = phoneIdx >= 0 && !!rowTextParts[phoneIdx];
      const looksLikeData = namePresent || emailPresent || phonePresent;

      if (nonEmpty === 0 || looksLikeNote || (!looksLikeData && nonEmpty <= 2)) {
        emptyStreak++;
        if (emptyStreak >= 1) break; // end table when we first encounter a footer/note row
        continue;
      }

      emptyStreak = 0;
      out.push(obj);
    }

    // Drop first "No" column if present
    return out.map((row) => {
      const clone: Record<string, any> = { ...row };
      const firstKey = Object.keys(clone)[0] || "";
      if (norm(firstKey) === "no" || norm(firstKey) === "n") delete clone[firstKey];
      return clone;
    });
  }

  function downloadClassTemplate() {
    const headers = [["Class Name"]];
    const ws = XLSX.utils.aoa_to_sheet(headers.concat([["PP"], ["SR"], ["KPS"]]));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Classes");
    XLSX.writeFile(wb, "classes_template.xlsx");
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top page tabs (Teachers / Classes) */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <button
          className={`px-3 py-1 rounded-full ${
            mainTab === "teachers" ? "bg-blue-100 text-blue-700" : "text-gray-500"
          }`}
          onClick={() => setMainTab("teachers")}
        >
          Teachers
        </button>
        <button
          className={`px-3 py-1 rounded-full ${
            mainTab === "classes" ? "bg-blue-100 text-blue-700" : "text-gray-500"
          }`}
          onClick={() => setMainTab("classes")}
        >
          Classes
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">13th Generation</h2>
          <p className="text-sm text-gray-500 mt-1">{mainTab === "teachers" ? "View teachers" : "View classrooms"}</p>
        </div>
        {/* no header actions, per latest UI */}
      </div>

      {/* Classes content */}
      {mainTab === "classes" && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Classroom</h3>
            <Button variant="outline" onClick={downloadClassTemplate}>
              <Download className="w-4 h-4 mr-2" /> Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(["PP", "SR", "KPS", "KPS"] as string[]).map((name, idx) => (
              <button key={idx} className="rounded-xl border py-5 text-left px-4 hover:border-blue-400">
                <span className="text-blue-600 font-semibold">{name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Department chips left; Template/Add Teacher on right */}
      {mainTab === "teachers" && activeTab === "list" && (
        <DepartmentToolbar
          deptTab={deptTab}
          onChangeDept={setDeptTab}
          onTemplate={downloadTemplate}
          onAdd={() => setActiveTab("create")}
        />
      )}

      {mainTab === "teachers" && activeTab === "list" && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="relative">
            <SearchBarActions
              query={query}
              onQuery={setQuery}
              genderFilter={filterGender}
              onGenderChange={setFilterGender}
              onFilterReset={() => setFilterStatus("all")}
              onMenuClick={() => setIsActionMenuOpen((v) => !v)}
            />
            {isActionMenuOpen && (
              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border w-48 z-10">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  onClick={() => {
                    if (selectedIds.length === 0) {
                      alert("Please select at least one teacher.");
                      return;
                    }
                    const first = teachers.find((t) => selectedIds.includes(t.id));
                    setPendingStatus((first?.status as TeacherStatus) || "active");
                    setIsStatusModalOpen(true);
                    setIsActionMenuOpen(false);
                  }}
                >
                  Change Status
                </button>
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50"
                  onClick={() => {
                    if (selectedIds.length !== 1) {
                      alert("Please select exactly one teacher to edit.");
                      return;
                    }
                    const first = teachers.find((t) => selectedIds.includes(t.id));
                    if (!first) return;
                    setSelected(first);
                    setActiveTab("edit");
                    setIsActionMenuOpen(false);
                  }}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden border rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 w-10"></th>
                  <th className="p-4">Teacher</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Subjects</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="p-4"><input type="checkbox" checked={selectedIds.includes(t.id)} onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectedIds((prev) => checked ? [...prev, t.id] : prev.filter((id) => id !== t.id));
                    }} /></td>
                    <td className="p-4">
                      <button className="flex items-center gap-3 text-left w-full" onClick={() => setSelected(t)}>
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div>
                          <div className="font-medium">{t.firstName} {t.lastName}</div>
                          <div className="text-sm text-gray-500">{t.email}</div>
                        </div>
                      </button>
                    </td>
                    <td className="p-4">{t.gender || "N/A"}</td>
                    <td className="p-4">{t.className || "N/A"}</td>
                    <td className="p-4">
                      {t.subjects?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {t.subjects.map((s, i) => (
                            <Badge key={i} variant="secondary">{s}</Badge>
                          ))}
                        </div>
                      ) : (
                        <Badge variant="secondary">N/A</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={
                        t.status === "active"
                          ? "bg-green-100 text-green-700"
                          : t.status === "graduated"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        aria-label="Edit teacher"
                        className="p-2 rounded-md hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(t);
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
        </div>
      )}

      {mainTab === "teachers" && activeTab === "create" && (
        <CreateTeacher
          onCancel={() => setActiveTab("list")}
          onSubmit={handleCreate}
          onSwitchTab={(tab) => setActiveTab(tab)}
        />
      )}

      {mainTab === "teachers" && activeTab === "import" && (
        <ImportExcel
          onCancel={() => setActiveTab("list")}
          onFile={handleExcel}
          onSwitchTab={(tab) => setActiveTab(tab)}
        />
      )}

      {mainTab === "teachers" && activeTab === "edit" && selected && (
        <EditTeacher
          teacher={selected}
          onCancel={() => setActiveTab("list")}
          onSave={(updates) => {
            updateTeacher(selected.id, updates);
            // Ensure detail modal shows updated info immediately after save
            setSelected((prev) => (prev ? { ...prev, ...updates } as Teacher : prev));
            setActiveTab("list");
          }}
        />
      )}

      {mainTab === "teachers" && selected && activeTab === "list" && (
        <TeacherDetailModal
          teacher={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setActiveTab("edit");
          }}
          onUpdateStatus={() => {
            setSelectedIds([selected.id]);
            setIsStatusModalOpen(true);
          }}
        />)
      }

      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsStatusModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[360px] p-6">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={pendingStatus === "active"} onChange={() => setPendingStatus("active")} />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={pendingStatus === "inactive"} onChange={() => setPendingStatus("inactive")} />
                In Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" checked={pendingStatus === "graduated"} onChange={() => setPendingStatus("graduated")} />
                Graduated
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
                if (selectedIds.length === 0) { setIsStatusModalOpen(false); return; }
                selectedIds.forEach((id) => updateTeacher(id, { status: pendingStatus }));
                setIsStatusModalOpen(false);
              }}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
