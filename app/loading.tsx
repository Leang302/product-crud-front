"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-800">Loading...</h2>
            <p className="text-gray-600 text-sm">
              Please wait while we prepare your content
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
