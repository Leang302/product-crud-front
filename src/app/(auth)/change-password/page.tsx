"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Schema = z
  .object({
    password: z.string().min(6),
    confirm: z.string().min(6),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export default function ChangePasswordPage() {
  const { register, handleSubmit, formState } = useForm<{
    password: string;
    confirm: string;
  }>({ resolver: zodResolver(Schema) });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password securely</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(() => {})} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirm")}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {formState.errors.confirm && (
                  <p className="text-sm text-red-600 mt-1">
                    {formState.errors.confirm.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
