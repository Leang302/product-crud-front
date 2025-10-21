"use client"

import type { LucideIcon } from "lucide-react"
import { Card } from "../ui/card"
import { cn } from "../lib/utils"

interface TaskTypeCardProps {
  icon: LucideIcon
  label: string
  description: string
  selected?: boolean
  onClick: () => void
}

export function TaskTypeCard({ icon: Icon, label, description, selected, onClick }: TaskTypeCardProps) {
  return (
    <Card
      className={cn(
        "flex cursor-pointer flex-col items-center gap-3 p-6 transition-all hover:border-primary hover:shadow-sm",
        selected && "border-primary bg-primary/5",
      )}
      onClick={onClick}
    >
      <div className={cn("rounded-lg bg-muted p-3", selected && "bg-primary/10")}>
        <Icon className={cn("h-6 w-6 text-muted-foreground", selected && "text-primary")} />
      </div>
      <div className="text-center">
        <h3 className="font-semibold">{label}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  )
}
