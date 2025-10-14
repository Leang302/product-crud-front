"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"   
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
    import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ClassSelector } from "./class-selector"
import { FileUploadZone } from "./file-upload-zone"
import { AVAILABLE_CLASSES, LANGUAGES } from "../lib/constants"
import type { Task } from "../lib/types"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSubmit: (data: Partial<Task>) => void
}

export function EditTaskDialog({ open, onOpenChange, task, onSubmit }: EditTaskDialogProps) {
  const [formData, setFormData] = useState<Partial<Task>>(task || {})

  const handleSubmit = () => {
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <div>
            <DialogTitle className="text-xl">Edit Task Information</DialogTitle>
            <p className="mt-1 text-sm text-muted-foreground">Review and update task information as needed.</p>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Task Title</Label>
            <Input
              id="edit-title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-instructions">Instructions</Label>
            <Textarea
              id="edit-instructions"
              rows={6}
              value={formData.instructions || ""}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Classes</Label>
            <ClassSelector
              classes={AVAILABLE_CLASSES}
              selectedClasses={formData.classes?.map((c) => c.id) || []}
              onChange={(classIds) => {
                const selectedClasses = AVAILABLE_CLASSES.filter((c) => classIds.includes(c.id))
                setFormData({ ...formData, classes: selectedClasses })
              }}
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
                  <RadioGroupItem value="individual" id="edit-individual" />
                  <Label htmlFor="edit-individual" className="font-normal">
                    Individual
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="group" id="edit-group" />
                  <Label htmlFor="edit-group" className="font-normal">
                    Group
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-language">Choose subject</Label>
              <Select
                value={formData.language}
                onValueChange={(value: string) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger id="edit-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">Start Date</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Due Date</Label>
              <Input
                id="edit-dueDate"
                type="datetime-local"
                value={formData.dueDate || ""}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Uploaded Files</Label>
              <Button variant="ghost" size="sm" className="h-8 text-primary">
                + Add Attachment
              </Button>
            </div>
            <FileUploadZone
              files={formData.attachments || []}
              onChange={(files) => setFormData({ ...formData, attachments: files })}
            />
          </div>
        </div>

        <div className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={handleClose}>
            Back
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
