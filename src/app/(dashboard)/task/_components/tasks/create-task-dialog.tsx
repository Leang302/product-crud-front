"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
// Removed Language select - backend doesn't require it
import { TaskTypeCard } from "./task-type-card"
// Removed ClassSelector - backend doesn't require it
import { FileUploadZone } from "./file-upload-zone"
  import { TASK_TYPES } from "../lib/constants"
import type { TaskType, CreateTaskFormData } from "../lib/types"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateTaskFormData) => void
}

type Step = "select-type" | "task-details" | "confirmation"

export function CreateTaskDialog({ open, onOpenChange, onSubmit }: CreateTaskDialogProps) {
  const [step, setStep] = useState<Step>("select-type")
  const [formData, setFormData] = useState<Partial<CreateTaskFormData>>({
    submissionType: "individual",
    attachments: [],
  })

  const handleTaskTypeSelect = (type: TaskType) => {
    setFormData({ ...formData, taskType: type })
    setStep("task-details")
  }

  const handleNext = () => {
    if (step === "task-details") {
      setStep("confirmation")
    }
  }

  const handleBack = () => {
    if (step === "task-details") {
      setStep("select-type")
    } else if (step === "confirmation") {
      setStep("task-details")
    }
  }

  const handleSubmit = () => {
    onSubmit(formData as CreateTaskFormData)
    handleClose()
  }

  const handleClose = () => {
    setStep("select-type")
    setFormData({
      submissionType: "individual",
      attachments: [],
    })
    onOpenChange(false)
  }

  const getStepTitle = () => {
    switch (step) {
      case "select-type":
        return "Select Task Type"
      case "task-details":
        return `Create New ${formData.taskType ? TASK_TYPES.find((t) => t.id === formData.taskType)?.label : "Task"}`
      case "confirmation":
        return "Task Confirmation"
    }
  }

  const getStepSubtitle = () => {
    switch (step) {
      case "select-type":
        return "Add a new task for your students"
      case "task-details":
        return "Fill in the details for your task"
      case "confirmation":
        return "Please review your task details before creating"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl">{getStepTitle()}</DialogTitle>
            <p className="mt-1 text-sm text-muted-foreground">{getStepSubtitle()}</p>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === "select-type" && (
            <div className="grid grid-cols-2 gap-4">
              {TASK_TYPES.map((type) => (
                <TaskTypeCard
                  key={type.id}
                  icon={type.icon}
                  label={type.label}
                  description={type.description}
                  selected={formData.taskType === type.id}
                  onClick={() => handleTaskTypeSelect(type.id as TaskType)}
                />
              ))}
            </div>
          )}

          {step === "task-details" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Enter task instructions"
                  rows={6}
                  value={formData.instructions || ""}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Submission Type</Label>
                  <RadioGroup
                    value={formData.submissionType}
                    onValueChange={(value: string) => setFormData({ ...formData, submissionType: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="font-normal">
                        Individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="group" id="group" />
                      <Label htmlFor="group" className="font-normal">
                        Group
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Removed Language selector */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={formData.dueDate || ""}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <FileUploadZone
                  files={formData.attachments || []}
                  onChange={(files) => setFormData({ ...formData, attachments: files })}
                />
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <div>
                <Label className="text-muted-foreground">Task Title</Label>
                <p className="font-medium">{formData.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Instructions</Label>
                <p className="whitespace-pre-wrap text-sm">{formData.instructions}</p>
              </div>
              {/* Removed Classes confirmation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Submission Type</Label>
                  <p className="capitalize">{formData.submissionType}</p>
                </div>
                {/* Removed Language confirmation */}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Start Date</Label>
                  <p>{formData.startDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{formData.dueDate}</p>
                </div>
              </div>
              {formData.attachments && formData.attachments.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Uploaded Files</Label>
                  <div className="mt-2 space-y-2">
                    {formData.attachments.map((file) => (
                      <p key={file.id} className="text-sm">
                        {file.name}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between border-t pt-4">
          {step !== "select-type" && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step === "select-type" && <div />}
          {step === "confirmation" ? (
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Task
            </Button>
          ) : step !== "select-type" ? (
            <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
