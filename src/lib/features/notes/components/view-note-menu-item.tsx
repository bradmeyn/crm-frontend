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
import type { FileNote, FileNoteDocument } from "@notes/types";
import { getFileNoteDocumentDownloadUrl } from "@notes/service";

interface ViewNoteMenuItemProps {
  note: FileNote;
}

export default function ViewNoteMenuItem({ note }: ViewNoteMenuItemProps) {
  const [open, setOpen] = useState(false);
  const [loadingDocumentId, setLoadingDocumentId] = useState<string | null>(
    null,
  );

  const handleOpenDocument = async (document: FileNoteDocument) => {
    try {
      setLoadingDocumentId(document.id);
      const url = await getFileNoteDocumentDownloadUrl(
        note.clientId,
        note.id,
        document.id,
      );
      window.open(url, "_blank", "noopener,noreferrer");
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
            <DialogDescription>Type: {note.type}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Content</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {note.content}
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
                          {document.fileName}
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
                          : "Open PDF"}
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
