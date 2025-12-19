"use client"
import { EPRenewalForm } from "@/components/ep-renewal-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LanguageProvider } from "@/contexts/language-context"
import Image from "next/image"
import logo from "@/public/TPLogo11.png"
export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={logo}
                  alt="TP Logo"
                  width={70}
                  height={80}
                  className="rounded-md bg-muted"
                  priority
                />
              </div>
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-foreground">Employment Pass Renewal</h1>
                  <p className="text-sm text-muted-foreground">Complete the form below to renew your EP</p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <EPRenewalForm />
        </main>
      </div>
    </LanguageProvider>
  )
}
