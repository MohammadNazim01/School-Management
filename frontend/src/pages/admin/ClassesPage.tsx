import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { classService } from "@/services/class.service";
import type { Class } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export function ClassesPage() {
  const qc = useQueryClient();
  const [classModal, setClassModal] = useState(false);
  const [sectionModal, setSectionModal] = useState<string | null>(null);
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, { id: string; name: string }[]>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: classService.list,
  });

  const createClass = useMutation({
    mutationFn: () => classService.create(className),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["classes"] }); toast.success("Class created!"); setClassModal(false); setClassName(""); },
  });

  const deleteClass = useMutation({
    mutationFn: classService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["classes"] }); toast.success("Class deleted."); setDeleteId(null); },
  });

  const createSection = useMutation({
    mutationFn: () => classService.createSection(sectionModal!, sectionName),
    onSuccess: (sec) => {
      setSections((prev) => ({ ...prev, [sectionModal!]: [...(prev[sectionModal!] ?? []), sec] }));
      toast.success("Section added!"); setSectionModal(null); setSectionName("");
    },
  });

  const toggleClass = async (id: string) => {
    setExpanded(expanded === id ? null : id);
    if (!sections[id]) {
      const secs = await classService.listSections(id);
      setSections((prev) => ({ ...prev, [id]: secs }));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes & Sections"
        description={`${classes.length} classes configured`}
        action={
          <Button variant="gradient" onClick={() => setClassModal(true)}>
            <Plus className="size-4" /> Add Class
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl border bg-muted animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {classes.map((cls) => (
            <Card key={cls.id} className="overflow-hidden">
              <button
                onClick={() => toggleClass(cls.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-sm font-bold">
                    {cls.name.slice(-2)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">{sections[cls.id]?.length ?? 0} sections</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); setSectionModal(cls.id); }}
                  >
                    <Plus className="size-3" /> Section
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => { e.stopPropagation(); setDeleteId(cls.id); }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                  {expanded === cls.id ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                </div>
              </button>
              <AnimatePresence>
                {expanded === cls.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t px-4 pb-4 pt-3 flex flex-wrap gap-2">
                      {(sections[cls.id] ?? []).map((sec) => (
                        <Badge key={sec.id} variant="secondary" className="text-sm px-3 py-1">
                          Section {sec.name}
                        </Badge>
                      ))}
                      {(sections[cls.id] ?? []).length === 0 && (
                        <p className="text-sm text-muted-foreground">No sections yet.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
          {classes.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-sm">No classes created yet.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={classModal} onOpenChange={setClassModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>New Class</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Class Name</Label>
            <Input placeholder='e.g. "Class 10"' value={className} onChange={(e) => setClassName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClassModal(false)}>Cancel</Button>
            <Button variant="gradient" loading={createClass.isPending} onClick={() => createClass.mutate()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!sectionModal} onOpenChange={(o) => !o && setSectionModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Section</DialogTitle></DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Section Name</Label>
            <Input placeholder='e.g. "A" or "B"' value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSectionModal(null)}>Cancel</Button>
            <Button variant="gradient" loading={createSection.isPending} onClick={() => createSection.mutate()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete class?"
        description="All sections under this class will be deleted. This cannot be undone."
        onConfirm={() => deleteId && deleteClass.mutate(deleteId)}
        loading={deleteClass.isPending}
      />
    </div>
  );
}
