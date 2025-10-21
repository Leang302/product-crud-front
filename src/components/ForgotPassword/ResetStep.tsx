"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/(dashboard)/task/_components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/app/(dashboard)/task/_components/ui/use-toast";
import { resetPasswordAction } from "@/action/authActions";
import { useRouter } from "next/navigation";

interface ResetStepProps {
  email: string;
  onBack: () => void;
  isLoading?: boolean;
  onComplete?: () => void;
}

export default function ResetStep({
  email,
  onBack,
  isLoading = false,
  onComplete,
}: ResetStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const validatePassword = (pwd: string) => {
    // Strong password: at least 8 chars, uppercase, lowercase, number, special char
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(pwd);
  };

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: 0, label: "", color: "" };
    if (pwd.length < 8)
      return { strength: 1, label: "Too short", color: "text-red-500" };

    let score = 0;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;

    if (score <= 2)
      return { strength: score, label: "Weak", color: "text-red-500" };
    if (score === 3)
      return { strength: score, label: "Good", color: "text-yellow-500" };
    return { strength: score, label: "Strong", color: "text-green-500" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast({
        title: "Password required",
        description: "Please enter a new password.",
        variant: "destructive" as any,
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Weak password",
        description:
          "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
        variant: "destructive" as any,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive" as any,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resetPasswordAction(email, password);
      if (result.success) {
        toast({
          title: "Password Reset Successfully",
          description:
            "Your password has been updated. Please sign in with your new password.",
        });

        // Redirect to login immediately
        router.push("/login");

        // Call completion callback after redirect to clean up state
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 100); // Small delay to ensure redirect happens first
      } else {
        toast({
          title: "Failed to reset password",
          description: result.message || "Please try again.",
          variant: "destructive" as any,
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to reset password",
        description: error?.message || "Please try again.",
        variant: "destructive" as any,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
        <p className="text-gray-600 mt-2">
          Create a strong password for{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={isSubmitting || isLoading}
              className="w-full pr-10"
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

          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength <= 2
                        ? "bg-red-500"
                        : passwordStrength.strength === 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${(passwordStrength.strength / 4) * 100}%`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs font-medium ${passwordStrength.color}`}
                >
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={isSubmitting || isLoading}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>

          {confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {passwordsMatch ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">
                    Passwords match
                  </span>
                </>
              ) : (
                <span className="text-xs text-red-500">
                  Passwords don't match
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Password requirements:</strong>
          </p>
          <ul className="text-xs text-blue-700 mt-1 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• One uppercase letter (A-Z)</li>
            <li>• One lowercase letter (a-z)</li>
            <li>• One number (0-9)</li>
            <li>• One special character (@$!%*?&)</li>
          </ul>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={
            isSubmitting ||
            isLoading ||
            !password ||
            !confirmPassword ||
            !passwordsMatch ||
            !validatePassword(password)
          }
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
        >
          Back to Verification
        </Button>
      </div>
    </div>
  );
}
