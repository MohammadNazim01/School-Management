import { useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";

export function SettingsPage() {
  const { user } = useAuthStore();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, sms: false, attendance: true, fees: true });

  const handlePasswordChange = async () => {
    if (!currentPw || !newPw) return;
    setLoading(true);
    try {
      await authService.changePassword(currentPw, newPw);
      toast.success("Password changed successfully!");
      setCurrentPw(""); setNewPw("");
    } catch { } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and system preferences" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
            <div className="space-y-1.5"><Label>Role</Label><Input value={user?.role ?? ""} disabled className="capitalize" /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Security</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>New Password</Label><Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></div>
          <Button variant="gradient" loading={loading} onClick={handlePasswordChange}>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
            { key: "sms", label: "SMS Alerts", desc: "Get SMS for critical updates" },
            { key: "attendance", label: "Attendance Alerts", desc: "Notify on absences" },
            { key: "fees", label: "Fee Reminders", desc: "Send payment reminders" },
          ].map((item, i) => (
            <div key={item.key}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={notifs[item.key as keyof typeof notifs]}
                  onCheckedChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
