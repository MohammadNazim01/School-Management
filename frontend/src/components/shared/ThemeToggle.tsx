import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";

export function ThemeToggle() {
  const { theme, toggleTheme } = useUIStore();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg">
      {theme === "dark" ? (
        <Sun className="size-4 text-amber-400" />
      ) : (
        <Moon className="size-4 text-slate-600" />
      )}
    </Button>
  );
}
