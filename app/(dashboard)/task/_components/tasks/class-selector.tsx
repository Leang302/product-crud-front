"use client"

import { Button } from "../ui/button"
import { cn } from "../lib/utils"

interface ClassSelectorProps {
  classes: ReadonlyArray<{ id: string; name: string; code: string }>
  selectedClasses: readonly string[]
  onChange: (classes: string[]) => void
}

export function ClassSelector({ classes, selectedClasses, onChange }: ClassSelectorProps) {
  const toggleClass = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      onChange(selectedClasses.filter((id) => id !== classId))
    } else {
      onChange([...selectedClasses, classId])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {classes.map((cls) => (
        <Button
          key={cls.id}
          type="button"
          variant={selectedClasses.includes(cls.id) ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full px-4",
            selectedClasses.includes(cls.id) && "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
          onClick={() => toggleClass(cls.id)}
        >
          {cls.code}
        </Button>
      ))}
    </div>
  )
}
