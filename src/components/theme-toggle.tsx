"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark" || resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 w-9 px-0"
      onClick={toggleTheme}
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={cn("h-4 w-4 transition-all", resolvedTheme === "dark" ? "hidden" : "block")} />
      <Moon className={cn("h-4 w-4 transition-all", resolvedTheme === "dark" ? "block" : "hidden")} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
