"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react"; // optional icon

export default function Page() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,       
      });
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logout */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My App</h1>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isLoggingOut ? (
              <>Logging out...</>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to the Homepage</h2>
          <p className="text-muted-foreground mb-8">
            You are now logged in. This is a protected page.
          </p>
        </div>
      </main>
    </div>
  );
}