"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface FileUploadSectionProps {
  title: string
  required?: boolean
  instructions: string[]
  file: File | null
  onFileChange: (file: File | null) => void
  error?: string
}

export function FileUploadSection({
  title,
  required = false,
  instructions,
  file,
  onFileChange,
  error,
}: FileUploadSectionProps) {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type - must be PDF
    if (selectedFile.type !== "application/pdf") {
      setFileError(t("uploads.errors.pdfOnly"))
      return
    }

    // Validate file size - must be <= 10MB
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setFileError(t("uploads.errors.tooLarge"))
      return
    }

    setFileError("")
    onFileChange(selectedFile)
  }

  const handleRemoveFile = () => {
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <Label className="text-base font-semibold">
          {title} {required && <span className="text-destructive">*</span>}
        </Label>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {t("uploads.viewInstructions")}
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">{t("uploads.requirements")}</p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="border-2 border-dashed border-border rounded-lg p-6">
        {!file ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="mt-4">
              <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                {t("uploads.chooseFile")}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("uploads.pdfOnly")} • {t("uploads.maxSize")}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Show validation errors */}
      {(fileError || error) && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{fileError || error}</p>
        </div>
      )}
    </div>
  )
}
