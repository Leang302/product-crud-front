"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MoreVertical } from "lucide-react";
import Link from "next/link";

export type GenerationRow = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export default function GenerationCard({ gen }: { gen: GenerationRow }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-lg">
                {gen.name.split(" ")[0]}
              </span>
            </div>
            <p className="text-sm text-gray-600">Students Group Photo</p>
          </div>
        </div>
        {gen.isActive && (
          <Badge
            variant="success"
            className="absolute top-3 right-3 bg-green-100 text-green-800"
          >
            Active
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">{gen.name}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              {gen.startDate} - {gen.endDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <Link href={`/generation/${gen.id}/teachers`}>
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
                View Classes
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
