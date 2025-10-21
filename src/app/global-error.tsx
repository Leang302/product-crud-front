"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-red-700">
                Application Error
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Something went wrong with the application. Please try again.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <p className="text-gray-600 font-medium mb-1">
                    Error Details:
                  </p>
                  <p className="text-gray-500 font-mono text-xs break-all">
                    {error.message || "An unknown error occurred"}
                  </p>
                  {error.digest && (
                    <p className="text-gray-400 text-xs mt-1">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If this problem persists, please contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
