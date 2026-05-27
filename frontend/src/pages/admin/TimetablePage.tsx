import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { classService } from "@/services/class.service";
import { timetableService } from "@/services/timetable.service";
import type { DayOfWeek } from "@/types";

const DAYS: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export function TimetablePage() {
  const [classId, setClassId] = useState("");

  const { data: classes = [] } = useQuery({ queryKey: ["classes"], queryFn: classService.list });
  const { data: schedule = [], isLoading } = useQuery({
    queryKey: ["timetable", classId],
    queryFn: () => timetableService.getByClass(classId),
    enabled: !!classId,
  });

  const byDay = DAYS.reduce((acc, day) => {
    acc[day] = schedule.filter((s) => s.day_of_week === day);
    return acc;
  }, {} as Record<DayOfWeek, typeof schedule>);

  const colors = ["bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"];

  return (
    <div className="space-y-6">
      <PageHeader title="Timetable" description="Class schedule management" />

      <div className="w-72">
        <Label className="text-xs text-muted-foreground mb-1.5 block">Select Class</Label>
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
          <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      {classId && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm capitalize flex items-center gap-2">
                  <Calendar className="size-4 text-primary" />{day}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isLoading ? (
                  <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />)}</div>
                ) : byDay[day].length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-3">No classes</p>
                ) : (
                  byDay[day].map((entry, i) => (
                    <div key={entry.id} className={`rounded-lg px-3 py-2 text-xs font-medium ${colors[i % colors.length]}`}>
                      <p className="font-semibold">{entry.start_time} – {entry.end_time}</p>
                      <p className="opacity-75 mt-0.5 truncate">Subject: {entry.subject_id.slice(0, 8)}…</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!classId && (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="size-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Select a class to view its timetable</p>
        </div>
      )}
    </div>
  );
}
