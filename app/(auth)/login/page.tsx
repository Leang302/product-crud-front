"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginSchema, type LoginForm } from "@/types";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/app/(dashboard)/task/_components/ui/use-toast";
import { useSession } from "next-auth/react";
import DemoUsers from "@/components/auth/DemoUsers";
import { getDefaultRedirectUrl } from "@/lib/permissions";
import { UserRole } from "@/types";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { status, data: session } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        // If there's a specific callback URL, use it
        router.replace(callbackUrl);
      } else {
        // Otherwise, redirect based on user role
        const userRole = session?.user?.role as UserRole | undefined;
        const defaultUrl = getDefaultRedirectUrl(userRole);
        toast({
          title: "Already signed in",
          description: `Redirecting to your ${userRole || "default"} page...`,
        });
        router.replace(defaultUrl);
      }
    }
  }, [status, router, searchParams, toast, session]);

  // Handle redirect after successful login
  useEffect(() => {
    if (shouldRedirect && status === "authenticated" && session) {
      const callbackUrl = searchParams.get("callbackUrl");
      const userRole = session?.user?.role as UserRole | undefined;

      let redirectUrl: string;
      if (callbackUrl) {
        redirectUrl = callbackUrl;
      } else {
        redirectUrl = getDefaultRedirectUrl(userRole);
      }

      toast({
        title: "Redirecting",
        description: `Taking you to your ${userRole || "default"} page...`,
      });

      router.push(redirectUrl);
      setShouldRedirect(false);
    }
  }, [shouldRedirect, status, session, router, searchParams, toast]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.ok) {
        toast({
          title: "Signed in successfully",
          description: "Welcome back! Redirecting...",
        });
        setShouldRedirect(true);
        return;
      }

      toast({
        title: "Sign in failed",
        description:
          (res?.error as string) ||
          "Invalid credentials. Please check and try again.",
        variant: "destructive" as any,
      });
    } catch (e: any) {
      toast({
        title: "Login failed",
        description: e?.message ?? "Unexpected error during sign-in.",
        variant: "destructive" as any,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">HRD Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Demo Users */}
        <DemoUsers />
      </div>
    </div>
  );
}
