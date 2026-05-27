import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Building2,
  ClipboardCheck, Trophy, BarChart3, DollarSign, Calendar,
  FileBarChart, Settings, ChevronLeft, ChevronRight, LogOut,
  Sparkles,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { UserRole } from "@/types";

interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
  roles?: UserRole[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navConfig: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard", roles: ["admin"] },
      { label: "Dashboard", icon: LayoutDashboard, to: "/teacher/dashboard", roles: ["teacher"] },
      { label: "Dashboard", icon: LayoutDashboard, to: "/student/dashboard", roles: ["student"] },
    ],
  },
  {
    group: "Academic",
    items: [
      { label: "Students", icon: GraduationCap, to: "/students", roles: ["admin", "teacher"] },
      { label: "Teachers", icon: Users, to: "/teachers", roles: ["admin"] },
      { label: "Classes", icon: Building2, to: "/classes", roles: ["admin"] },
      { label: "Subjects", icon: BookOpen, to: "/subjects", roles: ["admin", "teacher"] },
      { label: "My Classes", icon: Building2, to: "/my-classes", roles: ["teacher"] },
    ],
  },
  {
    group: "Tracking",
    items: [
      { label: "Attendance", icon: ClipboardCheck, to: "/attendance", roles: ["admin"] },
      { label: "Attendance", icon: ClipboardCheck, to: "/teacher/attendance", roles: ["teacher"] },
      { label: "Attendance", icon: ClipboardCheck, to: "/student/attendance", roles: ["student"] },
      { label: "Exams", icon: Trophy, to: "/exams", roles: ["admin", "teacher"] },
      { label: "Marks", icon: BarChart3, to: "/marks", roles: ["admin"] },
      { label: "Upload Marks", icon: BarChart3, to: "/teacher/marks", roles: ["teacher"] },
      { label: "Results", icon: Trophy, to: "/results", roles: ["student"] },
    ],
  },
  {
    group: "Finance",
    items: [
      { label: "Fees", icon: DollarSign, to: "/fees", roles: ["admin"] },
      { label: "My Fees", icon: DollarSign, to: "/student/fees", roles: ["student"] },
    ],
  },
  {
    group: "Schedule",
    items: [
      { label: "Timetable", icon: Calendar, to: "/timetable", roles: ["admin"] },
      { label: "Timetable", icon: Calendar, to: "/teacher/timetable", roles: ["teacher"] },
      { label: "Timetable", icon: Calendar, to: "/student/timetable", roles: ["student"] },
    ],
  },
  {
    group: "Reports",
    items: [
      { label: "Reports", icon: FileBarChart, to: "/reports", roles: ["admin"] },
      { label: "Settings", icon: Settings, to: "/settings", roles: ["admin"] },
    ],
  },
];

export function AppSidebar() {
  const { user, clearAuth } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const location = useLocation();

  const role = user?.role as UserRole;

  const filteredNav = navConfig.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.roles || item.roles.includes(role)),
  })).filter((group) => group.items.length > 0);

  const w = sidebarCollapsed ? 68 : 240;

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex h-screen flex-col border-r border-sidebar-border bg-sidebar overflow-hidden shrink-0"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border shrink-0">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
          <Sparkles className="size-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="font-bold text-base tracking-tight whitespace-nowrap"
            >
              EduCore
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6">
        {filteredNav.map((group) => (
          <div key={group.group}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "sidebar-item",
                      isActive && "sidebar-item-active",
                      sidebarCollapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className={cn("size-4 shrink-0", isActive ? "text-primary" : "")} />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15 }}
                          className="whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <Separator />

      {/* User + logout */}
      <div className="p-3 space-y-1">
        <div className={cn("flex items-center gap-3 px-2 py-2 rounded-lg", sidebarCollapsed && "justify-center")}>
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(user?.email?.split("@")[0] ?? "U")}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium truncate">{user?.email?.split("@")[0]}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={clearAuth}
          title={sidebarCollapsed ? "Logout" : undefined}
          className={cn(
            "sidebar-item w-full text-destructive hover:text-destructive hover:bg-destructive/10",
            sidebarCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-10 flex size-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="size-3" />
        ) : (
          <ChevronLeft className="size-3" />
        )}
      </button>
    </motion.aside>
  );
}
