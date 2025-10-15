"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import EmailStep from "@/components/ForgotPassword/EmailStep";
import OTPStep from "@/components/ForgotPassword/OTPStep";
import ResetStep from "@/components/ForgotPassword/ResetStep";

type Step = 1 | 2 | 3;

interface ForgotPasswordState {
  step: Step;
  email: string;
  otpSentAt?: number;
  otpVerified?: boolean;
}

const STORAGE_KEY = "forgot-password-state";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<ForgotPasswordState>({
    step: 1,
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and state restoration
  useEffect(() => {
    setIsHydrated(true);

    // Restore state from localStorage after hydration
    const savedState = localStorage.getItem(STORAGE_KEY);
    const stepParam = searchParams.get("step");
    const emailParam = searchParams.get("email");

    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        console.log("Restoring saved state:", parsedState);
        setState(parsedState);
      } catch (e) {
        console.error("Failed to parse saved state:", e);
        // If parsing fails, try URL params as fallback
        if (stepParam && emailParam) {
          setState({
            step: parseInt(stepParam) as Step,
            email: emailParam,
            otpSentAt: Date.now(),
          });
        }
      }
    } else if (stepParam && emailParam) {
      // Only use URL params if no saved state exists
      console.log("No saved state, using URL params");
      setState({
        step: parseInt(stepParam) as Step,
        email: emailParam,
        otpSentAt: Date.now(),
      });
    }
  }, []); // Only run once on mount

  // Cleanup function to remove state when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Only clear if user is navigating away from the forgot password flow
      // This prevents clearing state when refreshing the page
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/forgot-password")) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
  }, []);

  // Save state to localStorage whenever it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      console.log("Saving state to localStorage:", state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const handleEmailNext = (userEmail: string) => {
    setState({
      step: 2,
      email: userEmail,
      otpSentAt: Date.now(),
      otpVerified: false,
    });
  };

  const handleOTPResent = (newTimestamp: number) => {
    setState((prev) => ({
      ...prev,
      otpSentAt: newTimestamp,
    }));
  };

  const handleOTPNext = () => {
    setState((prev) => ({
      ...prev,
      step: 3,
      otpVerified: true,
    }));
  };

  const handleBack = () => {
    if (state.step === 2) {
      setState((prev) => ({
        ...prev,
        step: 1,
        otpSentAt: undefined,
        otpVerified: false,
      }));
    } else if (state.step === 3) {
      setState((prev) => ({
        ...prev,
        step: 2,
        otpVerified: false,
      }));
    }
  };

  const handleComplete = () => {
    // Clear state when password reset is complete
    localStorage.removeItem(STORAGE_KEY);
    // Don't reset state to step 1 - just redirect immediately
    // setState({
    //   step: 1,
    //   email: "",
    // });
  };

  const getStepTitle = () => {
    switch (state.step) {
      case 1:
        return "Forgot Password?";
      case 2:
        return "Verify Your Email";
      case 3:
        return "Reset Password";
      default:
        return "Forgot Password?";
    }
  };

  const getStepDescription = () => {
    switch (state.step) {
      case 1:
        return "Enter your email to receive a verification code";
      case 2:
        return "Enter the 6-digit code sent to your email";
      case 3:
        return "Create a new password for your account";
      default:
        return "Enter your email to receive a verification code";
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
        </div>

        {/* Show loading spinner while hydrating */}
        {!isHydrated ? (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      state.step >= stepNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-8 h-0.5 mx-2 ${
                        state.step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Main Card */}
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  {getStepDescription()}
                </p>
              </CardHeader>
              <CardContent>
                {state.step === 1 && (
                  <EmailStep onNext={handleEmailNext} isLoading={isLoading} />
                )}
                {state.step === 2 && (
                  <OTPStep
                    email={state.email}
                    onNext={handleOTPNext}
                    onBack={handleBack}
                    isLoading={isLoading}
                    otpSentAt={state.otpSentAt}
                    onOTPResent={handleOTPResent}
                  />
                )}
                {state.step === 3 && (
                  <ResetStep
                    email={state.email}
                    onBack={handleBack}
                    isLoading={isLoading}
                    onComplete={handleComplete}
                  />
                )}
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
