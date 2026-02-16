"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react"; // IMPORTANT: Import from next-auth/react
import { useRouter } from "next/navigation"; // Use Next router
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSchema, authSchema } from "@/lib/validation/auth-schema";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })
  const onSubmit = (data: AuthSchema) => {
    startTransition(async () => {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      })

      if(result?.code){
      toast.error(result.code)
      }
      else {
        router.push("/product")
        router.refresh()
        toast.success("Login successful. Welcome back!");
      }
    })
  }

  return (
    <Card className="mx-auto max-w-sm w-full border-0 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
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
              className={form.formState.errors.username ? "border-destructive" : ""}
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
              className={form.formState.errors.password ? "border-destructive" : ""}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <p className="text-end text-sm">Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>


          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}