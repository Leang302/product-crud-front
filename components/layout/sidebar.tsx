"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Home,
  BookOpen,
  Users,
  Building2,
  User,
  LogOut,
  Bell,
  Moon,
  ChevronDown,
  PanelLeftClose,
  PanelRightOpen,
} from "lucide-react";
import UserMenu from "@/components/topbar/UserMenu";

interface SidebarProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Generation", href: "/generation", icon: GraduationCap },
  { name: "Classroom", href: "/classroom", icon: BookOpen },
  { name: "Department", href: "/department", icon: Building2 },
  { name: "Staff", href: "/staff", icon: Users },
  { name: "Users", href: "/users", icon: Users },
  { name: "Task", href: "/task", icon: BookOpen },
];

const Sidebar = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapsed state across reloads
  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("sidebar:collapsed")
        : null;
    if (stored) setCollapsed(stored === "1");
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sidebar:collapsed", collapsed ? "1" : "0");
    }
  }, [collapsed]);

  const [openLogout, setOpenLogout] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-200",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "justify-between"
            )}
          >
            <div
              className={cn(
                "flex items-center",
                collapsed ? "space-x-0" : "space-x-3"
              )}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <span className="text-xl font-semibold text-gray-800">
                  HRD Portal
                </span>
              )}
            </div>
            {!collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            )}
            {collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setCollapsed(false)}
                title="Expand sidebar"
              >
                <PanelRightOpen className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1", collapsed ? "px-2 py-4" : "px-4 py-6")}>
          <div className="space-y-1">
            {!collapsed && (
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                Main
              </p>
            )}
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    collapsed ? "justify-center" : "space-x-3",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Actions */}
        <div
          className={cn(
            "p-4 border-t border-gray-200 space-y-2",
            collapsed && "flex flex-col items-center space-y-3"
          )}
        >
          <Link
            href="/profile"
            className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors",
              collapsed ? "justify-center" : "space-x-3"
            )}
            title="Profile"
          >
            <User className="w-5 h-5" />
            {!collapsed && <span>Profile</span>}
          </Link>
          <button
            className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full",
              collapsed ? "justify-center" : "space-x-3"
            )}
            title="Logout"
            onClick={() => setOpenLogout(true)}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout Account</span>}
          </button>
          <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Log out</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to sign in
                  again to continue.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenLogout(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-600/90"
                  onClick={() => {
                    setOpenLogout(false);
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                {navigation.find((item) => item.href === pathname)?.name ||
                  "Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {pathname === "/generation" && "Manage generations"}
                {pathname === "/task" && "Manage tasks"}
                {pathname === "/dashboard" && "Overview of your school"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <Moon className="w-5 h-5" />
              </Button>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
