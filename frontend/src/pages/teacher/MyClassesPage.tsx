import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Clock } from "lucide-react";

const myClasses = [
  { name: "Class 10-A", subject: "Mathematics", students: 32, periods: 5, room: "R-201" },
  { name: "Class 10-B", subject: "Mathematics", students: 28, periods: 5, room: "R-201" },
  { name: "Class 9-A", subject: "Mathematics", students: 30, periods: 4, room: "R-202" },
  { name: "Class 9-B", subject: "Mathematics", students: 29, periods: 4, room: "R-202" },
];

export function MyClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Classes" description={`You teach ${myClasses.length} classes this term`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myClasses.map((cls, i) => (
          <motion.div key={cls.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                  <Badge variant="secondary">{cls.room}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="size-3.5" /> {cls.subject}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="size-4 text-muted-foreground" />
                    <span><span className="font-semibold">{cls.students}</span> students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span><span className="font-semibold">{cls.periods}</span> periods/week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
