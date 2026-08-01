"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/constants/navigation";
import {
  LayoutDashboard,
  Brain,
  Network,
  Gift,
  Tag,
  Globe,
  Search,
  FileText,
  Edit3,
  Target,
  BarChart3,
  Shield,
  Activity,
  Plug,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Brain,
  Network,
  Gift,
  Tag,
  Globe,
  Search,
  FileText,
  Edit3,
  Target,
  BarChart3,
  Shield,
  Activity,
  Plug,
  Bell,
  Settings,
  LogOut,
};

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col w-64 bg-card border-r h-screen overflow-y-auto", className)}>
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          MAGIC DEAL WITH MJ
        </h1>
      </div>
      <nav className="flex-1 py-2">
        {navigation.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 my-0.5 transition-all",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon size={18} />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg mx-2 transition-all text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <LogOut size={18} />
          Logout
        </Link>
      </div>
    </aside>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="p-2 rounded-lg hover:bg-muted relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="hidden md:flex" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-muted/30">
          {children}
        </main>
      </div>
    </div>
  );
}
