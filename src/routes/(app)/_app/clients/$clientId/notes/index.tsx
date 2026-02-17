import { createFileRoute } from "@tanstack/react-router";
import { getNotes } from "@notes/service";
import { noteKeys, useNotes } from "@notes/hooks";
import { noteColumns } from "@notes/components/note-columns";
import AddNoteDialog from "@notes/components/add-note-dialog";
import { DataTable } from "@components/data-table";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Plus, FileText } from "lucide-react";

export const Route = createFileRoute("/(app)/_app/clients/$clientId/notes/")({
  component: NotesPage,
  loader: async ({ params: { clientId }, context: { queryClient } }) => {
    // Pre-fetch notes for SSR/initial load - ensures data is in cache
    await queryClient.ensureQueryData({
      queryKey: noteKeys.list(clientId),
      queryFn: () => getNotes(clientId),
    });
    return { clientId };
  },
});

function NotesPage() {
  const { clientId } = Route.useLoaderData();

  // Use the query hook to get reactive data that updates on invalidation
  const { data: notes = [] } = useNotes(clientId);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Notes</h2>
          <p className="text-muted-foreground">Manage notes for this client</p>
        </div>
        <AddNoteDialog clientId={clientId} />
      </div>

      {notes && notes.length > 0 ? (
        <DataTable
          data={notes}
          columns={noteColumns}
          searchPlaceholder="Search notes..."
          searchKeys={["title", "content", "type"]}
          pageSize={10}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No notes yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first note for this client
          </p>
          <AddNoteDialog
            clientId={clientId}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            }
          />
        </div>
      )}
    </Card>
  );
}
