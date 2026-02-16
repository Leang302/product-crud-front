"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { authSchema } from "@/lib/validation/auth-schema";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth-action";

interface RegisterFormData {
  username: string;
  password: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(authSchema), // Reuse login schema
    defaultValues: {
      username: "",
      password: ""
    }
  });

 const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await registerAction({ ...data });

        if (result?.errors) {
          toast.error("Validation failed");
    
          return;
        }

        if (result?.serverError) {
          toast.error(result.serverError);
          return;
        }

        toast.success("Account created successfully!");

         setTimeout(() => {
        router.push("/login");
      }, 300); 
      } catch (err) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Card className="mx-auto min-w-sm w-full border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription>
          Register to start managing products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              {...form.register("username")}
              disabled={isPending}
              placeholder="Enter your username"
               className={form.formState.errors.username? "border-destructive" : ""}
            />
            {form.formState.errors.username && (
              <p className="text-xs text-destructive">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              disabled={isPending}
              placeholder="Enter your password"
               className={form.formState.errors.password? "border-destructive" : ""}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
  <p className="text-end text-sm">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
