import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const schedule = {
  Monday: [{ time: "8:00–9:00", subject: "Mathematics", teacher: "Dr. Smith", room: "R-201" }, { time: "11:00–12:00", subject: "Science", teacher: "Ms. Johnson", room: "Lab-2" }],
  Tuesday: [{ time: "9:30–10:30", subject: "English", teacher: "Mr. Brown", room: "R-103" }, { time: "2:00–3:00", subject: "Art", teacher: "Ms. Green", room: "Art-1" }],
  Wednesday: [{ time: "8:00–9:00", subject: "History", teacher: "Ms. Davis", room: "R-205" }, { time: "10:00–11:00", subject: "Mathematics", teacher: "Dr. Smith", room: "R-201" }],
  Thursday: [{ time: "9:30–10:30", subject: "Science", teacher: "Ms. Johnson", room: "Lab-2" }, { time: "11:30–12:30", subject: "English", teacher: "Mr. Brown", room: "R-103" }],
  Friday: [{ time: "8:00–9:00", subject: "Mathematics", teacher: "Dr. Smith", room: "R-201" }, { time: "2:00–3:00", subject: "PE", teacher: "Coach Ali", room: "Gym" }],
  Saturday: [],
};

const colors = [
  "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
];

export function StudentTimetablePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Your weekly class schedule" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.entries(schedule) as [string, { time: string; subject: string; teacher: string; room: string }[]][]).map(([day, slots]) => (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="size-4 text-primary" />{day}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {slots.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-3">No classes</p>
              ) : (
                slots.map((slot, i) => (
                  <div key={i} className={`rounded-lg px-3 py-2 text-xs font-medium ${colors[i % colors.length]}`}>
                    <p className="font-semibold font-mono">{slot.time}</p>
                    <p className="mt-0.5 font-semibold">{slot.subject}</p>
                    <p className="opacity-70">{slot.teacher} · {slot.room}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
