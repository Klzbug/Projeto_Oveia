"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load theme from localStorage on mount. Default to light mode.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to light mode on first load so the user sees the original color palette
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 border border-areia bg-la hover:bg-areia/40 rounded-full flex items-center justify-center transition-colors text-cabrito focus:outline-none"
      title={theme === "light" ? "Ativar Modo Escuro" : "Ativar Modo Claro"}
      aria-label="Alternar tema"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-camurca" />
      ) : (
        <Sun className="w-5 h-5 text-milho" />
      )}
    </button>
  );
}
