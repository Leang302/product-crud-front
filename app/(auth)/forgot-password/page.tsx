"use client";

import { useState } from "react";
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

const StepSchema = z.object({ email: z.string().email() });
const OtpSchema = z.object({ otp: z.string().min(6).max(6) });
const ResetSchema = z
  .object({
    password: z.string().min(6),
    confirm: z.string().min(6),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const emailForm = useForm<{ email: string }>({
    resolver: zodResolver(StepSchema),
  });
  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(OtpSchema),
  });
  const resetForm = useForm<{ password: string; confirm: string }>({
    resolver: zodResolver(ResetSchema),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Recover your account using email and OTP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <form
                onSubmit={emailForm.handleSubmit(() => setStep(2))}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...emailForm.register("email")}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="you@example.com"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Send OTP
                </Button>
              </form>
            )}

            {step === 2 && (
              <form
                onSubmit={otpForm.handleSubmit(() => setStep(3))}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    {...otpForm.register("otp")}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="123456"
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-red-600 mt-1">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Verify OTP
                </Button>
              </form>
            )}

            {step === 3 && (
              <form
                onSubmit={resetForm.handleSubmit(() => setStep(1))}
                className="space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...resetForm.register("password")}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    {...resetForm.register("confirm")}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  {resetForm.formState.errors.confirm && (
                    <p className="text-sm text-red-600 mt-1">
                      {resetForm.formState.errors.confirm.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Update Password
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
