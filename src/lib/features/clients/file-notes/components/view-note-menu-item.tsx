import { useState } from "react";
import { toast } from "sonner";
import { FileText } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import type { FileNote } from "@clients/file-notes/types";
import type { ClientDocument } from "@clients/documents/types";

interface ViewNoteMenuItemProps {
  note: FileNote;
}

export default function ViewNoteMenuItem({ note }: ViewNoteMenuItemProps) {
  const [open, setOpen] = useState(false);
  const [loadingDocumentId, setLoadingDocumentId] = useState<string | null>(
    null,
  );

  const handleOpenDocument = async (document: ClientDocument) => {
    try {
      setLoadingDocumentId(document.id);
      if (!document.file) {
        throw new Error("Document URL is not available");
      }
      window.open(document.file, "_blank", "noopener,noreferrer");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Could not open document: ${message}`);
    } finally {
      setLoadingDocumentId(null);
    }
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}>
        View details
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{note.title}</DialogTitle>
            <DialogDescription>Type: {note.noteType}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Body</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {note.body}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Documents</h4>
              {note.documents && note.documents.length > 0 ? (
                <div className="space-y-2">
                  {note.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between rounded-md border p-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="truncate text-sm">
                          {document.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDocument(document)}
                        disabled={loadingDocumentId === document.id}>
                        {loadingDocumentId === document.id
                          ? "Opening..."
                          : "Open"}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No documents attached.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
