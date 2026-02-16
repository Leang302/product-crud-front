"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { validateOTPAction, requestOTPAction } from "@/action/authActions";
import CountdownTimer from "@/components/common/CountdownTimer";

interface OTPStepProps {
  email: string;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
  otpSentAt?: number;
  onOTPResent?: (newTimestamp: number) => void;
}

export default function OTPStep({
  email,
  onNext,
  onBack,
  isLoading = false,
  otpSentAt,
  onOTPResent,
}: OTPStepProps) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true); // Always allow resend
  const [isExpired, setIsExpired] = useState(false);
  const [resetKey, setResetKey] = useState(0); // Key to reset countdown timer
  const { toast } = useToast();

  // Calculate remaining time based on when OTP was sent
  const getRemainingTime = () => {
    if (!otpSentAt) return 300; // Default 5 minutes

    const elapsed = Math.floor((Date.now() - otpSentAt) / 1000);
    const remaining = Math.max(0, 300 - elapsed); // 5 minutes = 300 seconds

    if (remaining === 0) {
      setIsExpired(true);
      setCanResend(true);
    }

    return remaining;
  };

  const validateOTPCode = (code: string) => {
    return /^\d{6}$/.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast({
        title: "OTP required",
        description: "Please enter the 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    if (!validateOTPCode(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await validateOTPAction(email, otp);
      if (result.success) {
        toast({
          title: "OTP Verified",
          description: "Code verified successfully.",
        });
        onNext();
      } else {
        toast({
          title: "Invalid OTP",
          description: result.message || "Please check your code and try again.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Invalid OTP",
        description:
          error instanceof Error
            ? error.message
            : "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await requestOTPAction(email);
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: "A new 6-digit code has been sent to your email.",
        });
        // Don't disable resend - allow immediate resending
        setIsExpired(false);
        setOtp("");

        // Update the timestamp in localStorage
        const savedState = localStorage.getItem("forgot-password-state");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          parsedState.otpSentAt = Date.now();
          localStorage.setItem(
            "forgot-password-state",
            JSON.stringify(parsedState)
          );
        }

        // Notify parent component to reset countdown
        if (onOTPResent) {
          onOTPResent(Date.now());
        }

        // Reset the countdown timer
        setResetKey((prev) => prev + 1);
      } else {
        toast({
          title: "Failed to resend OTP",
          description: result.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Failed to resend OTP",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleExpire = () => {
    setIsExpired(true);
    // Keep resend button always enabled
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Enter Verification Code
        </h2>
        <p className="text-gray-600 mt-2">
          We've sent a 6-digit code to{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <CountdownTimer
        initialSeconds={getRemainingTime()}
        onExpire={handleExpire}
        className="mb-6"
        resetKey={resetKey}
      />

      {isExpired && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 font-medium">
            Your OTP has expired. Please resend a new one.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Verification Code
          </label>
          <Input
            id="otp"
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="000000"
            disabled={isSubmitting || isLoading}
            className="w-full text-center text-2xl font-mono tracking-widest"
            maxLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the 6-digit code from your email
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isSubmitting || isLoading || !otp.trim() || isExpired}
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </Button>
      </form>

      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code? You can resend immediately.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleResend}
          disabled={isResending || isLoading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          {isResending ? "Resending..." : "Resend OTP"}
        </Button>

        <Button
          variant="ghost"
          className="w-full"
          onClick={onBack}
          disabled={isSubmitting || isLoading}
        >
          Back to Email
        </Button>
      </div>
    </div>
  );
}
