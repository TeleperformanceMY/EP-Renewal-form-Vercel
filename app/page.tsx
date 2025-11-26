"use client"
import { EPRenewalForm } from "@/components/ep-renewal-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LanguageProvider } from "@/contexts/language-context"

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Employment Pass Renewal</h1>
              <p className="text-sm text-muted-foreground">Complete the form below to renew your EP</p>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <EPRenewalForm />
        </main>
      </div>
    </LanguageProvider>
  )
}
