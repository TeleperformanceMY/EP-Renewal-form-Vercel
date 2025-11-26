"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUploadSection } from "@/components/file-upload-section"
import { useLanguage } from "@/contexts/language-context"
import { Loader2 } from "lucide-react"

interface FormData {
  renewEP: "yes" | "no" | ""
  dependents: "yes" | "no" | ""
  email: string
  bmsNumber: string
  fullName: string
  passportNumber: string
  passportExpiry: string
  issueCountry: string
  passportIssue: string
  taxNumber: string
  location: string
  passportCopy: File | null
  contractLetter: File | null
  eFilingSlip: File | null
  resume: File | null
  certificates: File | null
}

export function EPRenewalForm() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    renewEP: "",
    dependents: "",
    email: "",
    bmsNumber: "",
    fullName: "",
    passportNumber: "",
    passportExpiry: "",
    issueCountry: "",
    passportIssue: "",
    taxNumber: "",
    location: "",
    passportCopy: null,
    contractLetter: null,
    eFilingSlip: null,
    resume: null,
    certificates: null,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.renewEP) {
      newErrors.renewEP = t("errors.required")
    }

    if (formData.renewEP === "yes") {
      // Validate all required fields
      if (!formData.dependents) newErrors.dependents = t("errors.required")
      if (!formData.email) newErrors.email = t("errors.required")
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("errors.invalidEmail")
      if (!formData.bmsNumber) newErrors.bmsNumber = t("errors.required")
      if (!formData.fullName) newErrors.fullName = t("errors.required")
      if (!formData.passportNumber) newErrors.passportNumber = t("errors.required")
      if (!formData.passportExpiry) newErrors.passportExpiry = t("errors.required")
      if (!formData.issueCountry) newErrors.issueCountry = t("errors.required")
      if (!formData.passportIssue) newErrors.passportIssue = t("errors.required")
      if (!formData.taxNumber) newErrors.taxNumber = t("errors.required")
      if (!formData.location) newErrors.location = t("errors.required")

      // Validate required files
      if (!formData.passportCopy) newErrors.passportCopy = t("errors.fileRequired")
      if (!formData.contractLetter) newErrors.contractLetter = t("errors.fileRequired")
      if (!formData.eFilingSlip) newErrors.eFilingSlip = t("errors.fileRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data:...;base64, prefix
        const base64 = result.split(",")[1]
        resolve(base64)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    setIsSubmitting(true)

    try {
      // Build the JSON payload
      const payload: any = {
        renewEP: formData.renewEP,
      }

      // If user selected "yes", include all other fields
      if (formData.renewEP === "yes") {
        payload.dependents = formData.dependents
        payload.email = formData.email
        payload.bmsNumber = formData.bmsNumber
        payload.fullName = formData.fullName
        payload.passportNumber = formData.passportNumber
        payload.passportExpiry = formData.passportExpiry
        payload.issueCountry = formData.issueCountry
        payload.passportIssue = formData.passportIssue
        payload.taxNumber = formData.taxNumber
        payload.location = formData.location

        // Convert files to base64
        if (formData.passportCopy) {
          const content = await fileToBase64(formData.passportCopy)
          payload.passportCopy = {
            name: formData.passportCopy.name,
            content,
            contentType: formData.passportCopy.type,
          }
        }

        if (formData.contractLetter) {
          const content = await fileToBase64(formData.contractLetter)
          payload.contractLetter = {
            name: formData.contractLetter.name,
            content,
            contentType: formData.contractLetter.type,
          }
        }

        if (formData.eFilingSlip) {
          const content = await fileToBase64(formData.eFilingSlip)
          payload.eFilingSlip = {
            name: formData.eFilingSlip.name,
            content,
            contentType: formData.eFilingSlip.type,
          }
        }

        // Optional files
        if (formData.resume) {
          const content = await fileToBase64(formData.resume)
          payload.resume = {
            name: formData.resume.name,
            content,
            contentType: formData.resume.type,
          }
        }

        if (formData.certificates) {
          const content = await fileToBase64(formData.certificates)
          payload.certificates = {
            name: formData.certificates.name,
            content,
            contentType: formData.certificates.type,
          }
        }
      }

      // Send to Power Automate
      const response = await fetch(
        "https://d8855a0b6453e4089c94add3719cb2.9c.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/5206d7f243954bf2a205b6dc1d528385/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wnxIbvfu9DJwyzrFlzJTgjaJf-MqRxpBr78Vv5gUzR4",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      // Success - reset form and scroll to top
      alert(t("success.submitted"))
      setFormData({
        renewEP: "",
        dependents: "",
        email: "",
        bmsNumber: "",
        fullName: "",
        passportNumber: "",
        passportExpiry: "",
        issueCountry: "",
        passportIssue: "",
        taxNumber: "",
        location: "",
        passportCopy: null,
        contractLetter: null,
        eFilingSlip: null,
        resume: null,
        certificates: null,
      })
      setErrors({})
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      alert(t("errors.submitFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t("form.title")}</CardTitle>
          <CardDescription>{t("form.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Initial Question */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              {t("form.initialQuestion")} <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={formData.renewEP}
              onValueChange={(value: "yes" | "no") => setFormData({ ...formData, renewEP: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="renew-yes" />
                <Label htmlFor="renew-yes" className="font-normal cursor-pointer">
                  {t("form.yes")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="renew-no" />
                <Label htmlFor="renew-no" className="font-normal cursor-pointer">
                  {t("form.no")}
                </Label>
              </div>
            </RadioGroup>
            {errors.renewEP && <p className="text-sm text-destructive">{errors.renewEP}</p>}
          </div>

          {/* Show remaining questions if user selects "Yes" */}
          {formData.renewEP === "yes" && (
            <>
              {/* Dependents Question */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {t("form.dependents")} <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.dependents}
                  onValueChange={(value: "yes" | "no") => setFormData({ ...formData, dependents: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="dependents-yes" />
                    <Label htmlFor="dependents-yes" className="font-normal cursor-pointer">
                      {t("form.yes")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="dependents-no" />
                    <Label htmlFor="dependents-no" className="font-normal cursor-pointer">
                      {t("form.no")}
                    </Label>
                  </div>
                </RadioGroup>
                {errors.dependents && <p className="text-sm text-destructive">{errors.dependents}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  {t("form.email")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="person@example.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* BMS Number */}
              <div className="space-y-2">
                <Label htmlFor="bmsNumber" className="text-base font-semibold">
                  {t("form.bmsNumber")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="bmsNumber"
                  value={formData.bmsNumber}
                  onChange={(e) => setFormData({ ...formData, bmsNumber: e.target.value })}
                  placeholder="BMS12345"
                  className={errors.bmsNumber ? "border-destructive" : ""}
                />
                {errors.bmsNumber && <p className="text-sm text-destructive">{errors.bmsNumber}</p>}
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base font-semibold">
                  {t("form.fullName")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Alex Tan"
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              {/* Passport Number */}
              <div className="space-y-2">
                <Label htmlFor="passportNumber" className="text-base font-semibold">
                  {t("form.passportNumber")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                  placeholder="A12345678"
                  className={errors.passportNumber ? "border-destructive" : ""}
                />
                {errors.passportNumber && <p className="text-sm text-destructive">{errors.passportNumber}</p>}
              </div>

              {/* Passport Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="passportExpiry" className="text-base font-semibold">
                  {t("form.passportExpiry")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="passportExpiry"
                  type="date"
                  value={formData.passportExpiry}
                  onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                  className={errors.passportExpiry ? "border-destructive" : ""}
                />
                {errors.passportExpiry && <p className="text-sm text-destructive">{errors.passportExpiry}</p>}
              </div>

              {/* Passport Issue Country */}
              <div className="space-y-2">
                <Label htmlFor="issueCountry" className="text-base font-semibold">
                  {t("form.issueCountry")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="issueCountry"
                  value={formData.issueCountry}
                  onChange={(e) => setFormData({ ...formData, issueCountry: e.target.value })}
                  placeholder="Malaysia"
                  className={errors.issueCountry ? "border-destructive" : ""}
                />
                {errors.issueCountry && <p className="text-sm text-destructive">{errors.issueCountry}</p>}
              </div>

              {/* Passport Date of Issue */}
              <div className="space-y-2">
                <Label htmlFor="passportIssue" className="text-base font-semibold">
                  {t("form.passportIssue")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="passportIssue"
                  type="date"
                  value={formData.passportIssue}
                  onChange={(e) => setFormData({ ...formData, passportIssue: e.target.value })}
                  className={errors.passportIssue ? "border-destructive" : ""}
                />
                {errors.passportIssue && <p className="text-sm text-destructive">{errors.passportIssue}</p>}
              </div>

              {/* Income Tax Number */}
              <div className="space-y-2">
                <Label htmlFor="taxNumber" className="text-base font-semibold">
                  {t("form.taxNumber")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="taxNumber"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  placeholder="IG987654321"
                  className={errors.taxNumber ? "border-destructive" : ""}
                />
                {errors.taxNumber && <p className="text-sm text-destructive">{errors.taxNumber}</p>}
              </div>

              {/* Location for Passport Handover/Collection */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-base font-semibold">
                  {t("form.location")} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger className={errors.location ? "border-destructive" : ""}>
                    <SelectValue placeholder={t("form.selectLocation")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office">{t("form.office")}</SelectItem>
                    <SelectItem value="home">{t("form.home")}</SelectItem>
                    <SelectItem value="courier">{t("form.courier")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              {/* File Upload Sections */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-xl font-semibold">{t("form.requiredDocuments")}</h3>

                {/* Passport Copy */}
                <FileUploadSection
                  title={t("uploads.passportCopy.title")}
                  required
                  instructions={[
                    t("uploads.passportCopy.inst1"),
                    t("uploads.passportCopy.inst2"),
                    t("uploads.passportCopy.inst3"),
                    t("uploads.passportCopy.inst4"),
                    t("uploads.passportCopy.inst5"),
                  ]}
                  file={formData.passportCopy}
                  onFileChange={(file) => setFormData({ ...formData, passportCopy: file })}
                  error={errors.passportCopy}
                />

                {/* Contract Letter */}
                <FileUploadSection
                  title={t("uploads.contractLetter.title")}
                  required
                  instructions={[t("uploads.contractLetter.inst1"), t("uploads.contractLetter.inst2")]}
                  file={formData.contractLetter}
                  onFileChange={(file) => setFormData({ ...formData, contractLetter: file })}
                  error={errors.contractLetter}
                />

                {/* E-Filing or E-Pin Slip */}
                <FileUploadSection
                  title={t("uploads.eFilingSlip.title")}
                  required
                  instructions={[
                    t("uploads.eFilingSlip.inst1"),
                    t("uploads.eFilingSlip.inst2"),
                    t("uploads.eFilingSlip.inst3"),
                    t("uploads.eFilingSlip.inst4"),
                    t("uploads.eFilingSlip.inst5"),
                    t("uploads.eFilingSlip.inst6"),
                    t("uploads.eFilingSlip.inst7"),
                    t("uploads.eFilingSlip.inst8"),
                  ]}
                  file={formData.eFilingSlip}
                  onFileChange={(file) => setFormData({ ...formData, eFilingSlip: file })}
                  error={errors.eFilingSlip}
                />
              </div>

              {/* Optional Documents */}
              <div className="space-y-6 pt-6 border-t">
                <h3 className="text-xl font-semibold">{t("form.optionalDocuments")}</h3>

                {/* Resume/CV */}
                <FileUploadSection
                  title={t("uploads.resume.title")}
                  instructions={[t("uploads.resume.inst1")]}
                  file={formData.resume}
                  onFileChange={(file) => setFormData({ ...formData, resume: file })}
                />

                {/* Professional/Academic Certificates */}
                <FileUploadSection
                  title={t("uploads.certificates.title")}
                  instructions={[t("uploads.certificates.inst1")]}
                  file={formData.certificates}
                  onFileChange={(file) => setFormData({ ...formData, certificates: file })}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || !formData.renewEP}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("form.submitting")}
                </>
              ) : (
                t("form.submit")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
