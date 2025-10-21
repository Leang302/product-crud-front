"use client"

import type React from "react"

import { Button } from "../ui/button"
import { cn } from "../lib/utils"
import { Loader2 } from "lucide-react"

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

export function ActionButton({
  variant = "default",
  size = "default",
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      className={cn("gap-2", className)}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon ? icon : null}
      {children}
    </Button>
  )
}
