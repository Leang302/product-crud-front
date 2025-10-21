"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, FileText, Pencil, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../lib/utils"
import type { TaskAttachment } from "../lib/types"

interface FileUploadZoneProps {
  files: TaskAttachment[]
  onChange: (files: TaskAttachment[]) => void
  maxSize?: number
}

export function FileUploadZone({ files, onChange, maxSize = 50 }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      const newFiles: TaskAttachment[] = droppedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        file,
        uploadProgress: 100,
        uploadedSuccessfully: true,
      }))

      onChange([...files, ...newFiles])
    },
    [files, onChange],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles: TaskAttachment[] = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      file,
      uploadProgress: 100,
      uploadedSuccessfully: true,
    }))

    onChange([...files, ...newFiles])
  }

  const removeFile = (fileId: string) => {
    onChange(files.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + "MB"
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
        )}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
        <p className="mb-2 text-center font-medium">Drag and drop your files</p>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Use URL, PDF (.pdf), Image (.PNG, .JPEG, .JPG) - up to {maxSize}MB
        </p>
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" size="sm" asChild>
            <span>Select File</span>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          {files.map((file, index) => (
            <div key={file.id || `${file.name}-${file.size}-${index}`} className="flex items-center justify-between rounded-lg border bg-card p-3">
              <div className="flex items-center gap-3">
                {file.file && file.file.type?.startsWith("image/") ? (
                  // Image thumbnail preview
                  <img
                    src={URL.createObjectURL(file.file)}
                    alt={file.name}
                    className="h-10 w-10 rounded object-cover border"
                  />
                ) : (
                  <FileText className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {file.uploadProgress}% • Uploaded Successfully
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4 text-yellow-600" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(file.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
