"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, LogOut, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/(dashboard)/task/_components/ui/alert-dialog";
import { toast } from "@/app/(dashboard)/task/_components/ui/use-toast";

export default function UserMenu() {
  const { data } = useSession();
  const [mounted, setMounted] = useState(false);
  const name = data?.user?.name || "User";
  const role = (data?.user as any)?.role as string | undefined;
  const [open, setOpen] = useState(false);

  // Avoid hydration mismatches by rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <button
        className="flex items-center space-x-2"
        onClick={() => setOpen(true)}
        title={`${name}${role ? ` (${role})` : ""}`}
      >
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
        <span className="sr-only">Logout</span>
        <LogOut className="w-4 h-4 text-gray-500 ml-1" />
      </button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-600/90"
              onClick={() => {
                setOpen(false);
                toast({
                  title: "Logged out",
                  description: "You have been signed out successfully.",
                });
                signOut({ callbackUrl: "/login" });
              }}
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
