import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileText, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

import { DataTable, type ColumnDef } from "@components/data-table";
import { Card } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  clientDocumentKeys,
  useClientDocuments,
  useDeleteClientDocument,
  useUploadClientDocument,
} from "@clients/documents/hooks";
import type { ClientDocument } from "@clients/documents/types";
import { getClientDocuments } from "@clients/documents/service";

const documentCategories = [
  { value: "IDENTIFICATION", label: "Identification" },
  { value: "FINANCIAL", label: "Financial" },
  { value: "COMPLIANCE", label: "Compliance" },
  { value: "SOA", label: "Statement of Advice" },
  { value: "TAX", label: "Tax" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "OTHER", label: "Other" },
] as const;

const uploadDocumentSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

type UploadDocumentForm = z.infer<typeof uploadDocumentSchema>;

export const Route = createFileRoute(
  "/(app)/_app/clients/$clientId/documents/",
)({
  component: DocumentsPage,
  loader: async ({ params: { clientId }, context: { queryClient } }) => {
    await queryClient.ensureQueryData({
      queryKey: clientDocumentKeys.list(clientId),
      queryFn: () => getClientDocuments(clientId),
    });
    return { clientId };
  },
});

function DocumentsPage() {
  const { clientId } = Route.useLoaderData();
  const { data: documents = [] } = useClientDocuments(clientId);
  const deleteClientDocument = useDeleteClientDocument();
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(
    null,
  );

  const documentColumns: ColumnDef<ClientDocument>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
    },
    {
      id: "size",
      header: "Size",
      accessorKey: "size",
      cell: ({ getValue }) => {
        const value = Number(getValue() ?? 0);
        const units = ["B", "KB", "MB", "GB"];
        let index = 0;
        let size = value;

        while (size >= 1024 && index < units.length - 1) {
          size /= 1024;
          index += 1;
        }

        return `${size.toFixed(1)} ${units[index]}`;
      },
    },
    {
      id: "createdAt",
      header: "Uploaded",
      accessorKey: "createdAt",
      cell: ({ getValue }) =>
        new Date(String(getValue())).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const doc = row.original;
        const isDeleting = deletingDocumentId === doc.id;

        return (
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(doc.file, "_blank", "noopener,noreferrer")
              }>
              Open
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => {
                const confirmed = window.confirm(
                  `Delete document \"${doc.name}\"? This cannot be undone.`,
                );

                if (!confirmed) {
                  return;
                }

                setDeletingDocumentId(doc.id);

                deleteClientDocument.mutate(
                  { clientId, documentId: doc.id },
                  {
                    onSuccess: () => {
                      toast.success("Document deleted");
                    },
                    onError: (error: Error) => {
                      toast.error(`Error deleting document: ${error.message}`);
                    },
                    onSettled: () => {
                      setDeletingDocumentId(null);
                    },
                  },
                );
              }}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Documents</h2>
          <p className="text-muted-foreground">
            Upload and manage documents for this client
          </p>
        </div>
        <UploadDocumentDialog clientId={clientId} />
      </div>

      {documents.length > 0 ? (
        <DataTable
          data={documents}
          columns={documentColumns}
          searchPlaceholder="Search documents..."
          searchKeys={["name", "category", "description"]}
          pageSize={10}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No documents uploaded</h3>
          <p className="text-muted-foreground mb-4">
            Upload the first document for this client
          </p>
          <UploadDocumentDialog
            clientId={clientId}
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            }
          />
        </div>
      )}
    </Card>
  );
}

function UploadDocumentDialog({
  clientId,
  trigger,
}: {
  clientId: string;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const uploadClientDocument = useUploadClientDocument();

  const form = useForm<UploadDocumentForm>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      category: "OTHER",
      description: "",
    },
  });

  const onSubmit = (data: UploadDocumentForm) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    uploadClientDocument.mutate(
      {
        clientId,
        file,
        category: data.category,
        description: data.description,
      },
      {
        onSuccess: () => {
          toast.success("Document uploaded successfully");
          setOpen(false);
          setFile(null);
          form.reset();
        },
        onError: (error: Error) => {
          toast.error(`Error uploading document: ${error.message}`);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setFile(null);
          form.reset();
        }
      }}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Client Document</DialogTitle>
          <DialogDescription>
            Add a new document for this client.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0] ?? null;
                    setFile(selectedFile);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadClientDocument.isPending}>
                {uploadClientDocument.isPending ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
