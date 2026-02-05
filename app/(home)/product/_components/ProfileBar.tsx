"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation"; // 1. Import usePathname
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils"; // shadcn utility for merging classes

export function ProfileBar() {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname(); // 2. Get current path

  const handleLogout = () => {
    setOpen(false);
    toast.success("Logged out successfully");
    setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, 300);
  };

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-20">
      <h3 className="text-lg font-semibold">Product Management</h3>
      
      <div className="flex items-center gap-6">
        <Link 
          href="/product" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/product") ? "text-black font-bold underline " : "text-muted-foreground"
          )}
        >
          Products
        </Link>
        <Link 
          href="/user" 
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive("/user") ?  "text-black font-bold underline "  : "text-muted-foreground"
          )}
        >
          User
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 cursor-pointer">
          {session?.user?.image ? (
            <AvatarImage src={session.user.image} />
          ) : (
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>

        <Button
          variant="outline"
          className="flex items-center gap-2 text-red-500"
          onClick={() => setOpen(true)}
        >
          Logout
          <LogOut className="w-4 h-4" />
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to log out?
            </p>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}