"use client";

import { Button } from "@/components/ui/button";
import { Filter, MoreVertical, Search } from "lucide-react";

export default function SearchBarActions({
  query,
  onQuery,
  genderFilter,
  onGenderChange,
  onFilterReset,
  onMenuClick,
}: {
  query: string;
  onQuery: (v: string) => void;
  genderFilter: 'all' | 'Male' | 'Female';
  onGenderChange: (g: 'all' | 'Male' | 'Female') => void;
  onFilterReset: () => void;
  onMenuClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4 relative">
      <div className="flex items-center gap-2 flex-1 max-w-xl border rounded-lg px-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          className="w-full py-2 outline-none"
          placeholder="Search here"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <select
          className="border rounded-md px-2 py-2 text-sm"
          value={genderFilter}
          onChange={(e) => onGenderChange(e.target.value as any)}
        >
          <option value="all">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button className="p-2 border rounded-md hover:bg-gray-50" onClick={onMenuClick}>
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


