"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  className?: string;
  resetKey?: number; // Add reset key to trigger timer reset
}

export default function CountdownTimer({
  initialSeconds,
  onExpire,
  className = "",
  resetKey,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  // Reset timer when resetKey changes
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [resetKey, initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onExpire?.();
      return;
    }

    const timer = setTimeout(() => {
      setSeconds(seconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds, onExpire]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isExpiring = seconds <= 30;

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`text-2xl font-mono font-bold ${
          isExpiring ? "text-red-600" : "text-blue-600"
        }`}
      >
        {formatTime(seconds)}
      </div>
      <div
        className={`text-sm mt-1 ${
          isExpiring ? "text-red-500" : "text-gray-500"
        }`}
      >
        {seconds <= 0 ? "OTP Expired" : "Time remaining"}
      </div>
    </div>
  );
}
