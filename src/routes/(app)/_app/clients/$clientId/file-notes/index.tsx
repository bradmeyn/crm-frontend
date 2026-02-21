import { createFileRoute } from "@tanstack/react-router";
import { getFileNotes } from "@clients/file-notes/service";
import { fileNoteKeys, useFileNotes } from "@clients/file-notes/hooks";
import { noteColumns } from "@clients/file-notes/components/note-columns";
import AddNoteDialog from "@clients/file-notes/components/add-note-dialog";
import { DataTable } from "@components/data-table";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Plus, FileText } from "lucide-react";

export const Route = createFileRoute(
  "/(app)/_app/clients/$clientId/file-notes/",
)({
  component: FileNotesPage,
  loader: async ({ params: { clientId }, context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: fileNoteKeys.list(clientId),
      queryFn: () => getFileNotes(clientId),
    });
    return { clientId };
  },
});

function FileNotesPage() {
  const { clientId } = Route.useLoaderData();
  const { data: fileNotes = [] } = useFileNotes(clientId);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">File Notes</h2>
          <p className="text-muted-foreground">
            Manage file notes for this client
          </p>
        </div>
        <AddNoteDialog clientId={clientId} />
      </div>

      {fileNotes.length > 0 ? (
        <DataTable
          data={fileNotes}
          columns={noteColumns}
          searchPlaceholder="Search file notes..."
          searchKeys={["title", "body", "noteType"]}
          pageSize={10}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No file notes yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first file note for this client
          </p>
          <AddNoteDialog
            clientId={clientId}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add File Note
              </Button>
            }
          />
        </div>
      )}
    </Card>
  );
}
