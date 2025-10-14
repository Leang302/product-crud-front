"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Edit3, Trash2 } from "lucide-react";
import { useDepartment } from "@/hooks/useDepartment";
import { useToast } from "@/app/(dashboard)/task/_components/ui/use-toast";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/(dashboard)/task/_components/ui/dialog";
import { Input } from "@/app/(dashboard)/task/_components/ui/input";

export default function DepartmentScreen() {
  const { departments, isLoading, error, refresh, create, update, remove } =
    useDepartment();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = useCallback(async () => {
    if (!name.trim()) return;
    const created = await create({ name: name.trim() });
    if (created) {
      toast({ title: "Department created", description: created.name });
      setOpen(false);
      setName("");
    } else if (error) {
      toast({
        title: "Create failed",
        description: error,
        variant: "destructive" as any,
      });
    }
  }, [create, name, toast, error]);

  const handleRename = useCallback(
    async (id: string, current: string) => {
      const name = window.prompt("New name", current);
      if (!name || name === current) return;
      const updated = await update(id, { name });
      if (updated) {
        toast({ title: "Department updated", description: updated.name });
      } else if (error) {
        toast({
          title: "Update failed",
          description: error,
          variant: "destructive" as any,
        });
      }
    },
    [update, toast, error]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const ok = window.confirm("Delete this department?");
      if (!ok) return;
      const success = await remove(id);
      if (success) {
        toast({ title: "Department deleted" });
      } else if (error) {
        toast({
          title: "Delete failed",
          description: error,
          variant: "destructive" as any,
        });
      }
    },
    [remove, toast, error]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Department Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage departments and staff
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Enter a name for the new department.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isLoading || !name.trim()}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-dashed">
              <div className="p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-200" />
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-10 w-full bg-gray-100 rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed rounded-lg text-center">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">No departments yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Get started by creating your first department.
          </p>
          <div className="mt-6">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Department
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <Card
              key={department.id}
              className="group border border-gray-100 hover:border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden"
            >
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ring-1 ring-blue-200">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold tracking-tight">
                        {department.name}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        ID: {department.id.slice(0, 8)}…
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-blue-600"
                      onClick={() =>
                        handleRename(department.id, department.name)
                      }
                      aria-label="Edit department"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-red-600"
                      onClick={() => handleDelete(department.id)}
                      aria-label="Delete department"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2.5 py-0.5 text-xs">
                    Department
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 hover:border-blue-300"
                    onClick={() => handleRename(department.id, department.name)}
                  >
                    Rename
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
