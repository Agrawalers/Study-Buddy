import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import type { TopicNote } from "@/pages/TopicNotes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: TopicNote | null;
  onEdit: () => void;
}

const NoteViewer = ({ open, onOpenChange, note, onEdit }: Props) => {
  if (!note) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center justify-between pr-8">
            <span>{note.title}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1.5 absolute right-12 top-4"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Topic
            </label>
            <p className="text-sm text-foreground mt-1">{note.topic}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Content
            </label>
            <p className="text-sm text-foreground mt-2 whitespace-pre-wrap leading-relaxed">
              {note.content || "No content"}
            </p>
          </div>
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Last updated: {new Date(note.updated_at).toLocaleString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteViewer;
