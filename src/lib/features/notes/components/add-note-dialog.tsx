import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { useCreateNote } from "@notes/hooks";
import { noteSchema, type NewNote, NOTE_TYPES } from "@notes/schemas";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { noteKeys } from "@notes/hooks";

interface AddNoteDialogProps {
  clientId: string;
  trigger?: React.ReactNode;
}

export default function AddNoteDialog({
  clientId,
  trigger,
}: AddNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const createNoteMutation = useCreateNote();

  const form = useForm<NewNote>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general",
    },
  });

  const onSubmit = (data: NewNote) => {
    createNoteMutation.mutate(
      {
        ...data,
        clientId,
        files,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: noteKeys.list(clientId) });
          toast.success("Note created successfully");
          setOpen(false);
          setFiles([]);
          form.reset();
        },
        onError: (error: Error) => {
          toast.error(`Error creating note: ${error.message}`);
        },
      },
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFiles([]);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
          <DialogDescription>Add a note for this client.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NOTE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your note here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>PDF Documents</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  onChange={(event) => {
                    const selectedFiles = event.target.files
                      ? Array.from(event.target.files)
                      : [];
                    setFiles(selectedFiles);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createNoteMutation.isPending}>
                {createNoteMutation.isPending ? "Creating..." : "Create Note"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
