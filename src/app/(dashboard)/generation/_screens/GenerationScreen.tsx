"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import GenerationCard, {
  type GenerationRow,
} from "../_components/GenerationCard";
import { Plus } from "lucide-react";

const mockGenerations: GenerationRow[] = [
  {
    id: "1",
    name: "12th Generation",
    startDate: "Jan 14, 2024",
    endDate: "Dec 13, 2024",
    isActive: true,
  },
  {
    id: "2",
    name: "11th Generation",
    startDate: "Jan 15, 2023",
    endDate: "Dec 14, 2023",
    isActive: false,
  },
  {
    id: "3",
    name: "10th Generation",
    startDate: "Jan 16, 2022",
    endDate: "Dec 15, 2022",
    isActive: false,
  },
  {
    id: "4",
    name: "9th Generation",
    startDate: "Jan 17, 2021",
    endDate: "Dec 16, 2021",
    isActive: false,
  },
  {
    id: "5",
    name: "8th Generation",
    startDate: "Jan 18, 2020",
    endDate: "Dec 17, 2020",
    isActive: false,
  },
  {
    id: "6",
    name: "7th Generation",
    startDate: "Jan 19, 2019",
    endDate: "Dec 18, 2019",
    isActive: false,
  },
  {
    id: "7",
    name: "6th Generation",
    startDate: "Jan 20, 2018",
    endDate: "Dec 19, 2018",
    isActive: false,
  },
  {
    id: "8",
    name: "5th Generation",
    startDate: "Jan 21, 2017",
    endDate: "Dec 20, 2017",
    isActive: false,
  },
];

export default function GenerationScreen() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Generation Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage generations</p>
        </div>
        <Link href="/generation/1/teachers">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Manage Teachers
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockGenerations.map((gen) => (
          <GenerationCard key={gen.id} gen={gen} />
        ))}
      </div>
    </div>
  );
}
