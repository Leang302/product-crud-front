"use client"

import type React from "react"

import { Button } from "../ui/button"
import { cn } from "../lib/utils"
import { Loader2 } from "lucide-react"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
  icon: React.ReactNode
  label?: string
}

export function IconButton({
  variant = "ghost",
  size = "icon",
  isLoading = false,
  icon,
  label,
  className,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      className={cn(className)}
      aria-label={label}
      title={label}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
    </Button>
  )
}
