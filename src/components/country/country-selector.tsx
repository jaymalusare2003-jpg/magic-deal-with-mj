"use client"

import { useState, useEffect } from "react"
import { Globe, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Country {
  code: string
  name: string
  flag: string
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦", AU: "🇦🇺", DE: "🇩🇪",
  FR: "🇫🇷", IN: "🇮🇳", BR: "🇧🇷", ES: "🇪🇸", IT: "🇮🇹",
  JP: "🇯🇵", KR: "🇰🇷", NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴",
}

interface CountrySelectorProps {
  countries: Country[]
  defaultCountry: string
  onCountryChange: (countryCode: string) => void
}

export function CountrySelector({ countries, defaultCountry, onCountryChange }: CountrySelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [isOpen, setIsOpen] = useState(false)
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)

  useEffect(() => {
    const detectCountry = async () => {
      const browserLocale = navigator.language?.split("-")[1]?.toUpperCase()
      const geoCountry = document.cookie
        .split("; ")
        .find(row => row.startsWith("detected_country="))
        ?.split("=")[1]

      if (geoCountry && countries.find(c => c.code === geoCountry)) {
        setDetectedCountry(geoCountry)
      } else if (browserLocale && countries.find(c => c.code === browserLocale)) {
        setDetectedCountry(browserLocale)
      }
    }
    detectCountry()
  }, [countries])

  const handleSelect = (code: string) => {
    setSelectedCountry(code)
    setIsOpen(false)
    onCountryChange(code)
    document.cookie = `selected_country=${code}; path=/; max-age=31536000`
  }

  const selected = countries.find(c => c.code === selectedCountry) || countries[0]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-card border rounded-lg shadow-lg hover:bg-muted transition-colors"
        >
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl">{COUNTRY_FLAGS[selected.code] || "🌐"}</span>
          <span className="text-sm font-medium">{selected.code}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-card border rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto">
              {detectedCountry && detectedCountry !== selectedCountry && (
                <div className="p-2 border-b">
                  <button
                    onClick={() => handleSelect(detectedCountry)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded text-left"
                  >
                    <span>Auto-detected:</span>
                    <span>{COUNTRY_FLAGS[detectedCountry] || "🌐"}</span>
                    <span>{detectedCountry}</span>
                  </button>
                </div>
              )}
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelect(country.code)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted text-left",
                    country.code === selectedCountry && "bg-muted font-medium"
                  )}
                >
                  <span>{COUNTRY_FLAGS[country.code] || "🌐"}</span>
                  <span className="w-12">{country.code}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                  {country.code === selectedCountry && <div className="w-2 h-2 bg-primary rounded-full" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
