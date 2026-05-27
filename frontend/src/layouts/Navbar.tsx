import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { getInitials, capitalize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function useBreadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  return parts.map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
}

export function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const breadcrumbs = useBreadcrumb();

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6"
    >
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-1">
        <span className="font-medium">EduCore</span>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span>/</span>
            <span className={i === breadcrumbs.length - 1 ? "text-foreground font-semibold" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="hidden md:block w-64">
        <Input
          leftIcon={<Search />}
          placeholder="Search... (⌘K)"
          className="bg-muted/40 border-0 focus-visible:ring-1 h-8"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-lg">
            <Bell className="size-4" />
          </Button>
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
        </div>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3 h-9 rounded-lg">
              <Avatar className="size-6">
                <AvatarFallback className="text-[10px]">
                  {getInitials(user?.email?.split("@")[0] ?? "U")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">
                {user?.email?.split("@")[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{user?.email?.split("@")[0]}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
                <Badge variant="secondary" className="w-fit mt-1">
                  {capitalize(user?.role ?? "")}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Change Password</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={clearAuth} className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
