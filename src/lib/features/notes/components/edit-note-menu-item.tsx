import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { useUpdateNote, noteKeys } from "@notes/hooks";
import { noteSchema, type NewNote, NOTE_TYPES } from "@notes/schemas";
import type { FileNote } from "@notes/types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EditNoteMenuItemProps {
  note: FileNote;
}

export default function EditNoteMenuItem({ note }: EditNoteMenuItemProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();
  const updateNoteMutation = useUpdateNote();

  const form = useForm<NewNote>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note.title,
      content: note.content,
      type: note.type,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      title: note.title,
      content: note.content,
      type: note.type,
    });
    setFiles([]);
  }, [form, note.content, note.title, note.type, open]);

  const onSubmit = (data: NewNote) => {
    updateNoteMutation.mutate(
      {
        id: note.id,
        clientId: note.clientId,
        ...data,
        files,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: noteKeys.list(note.clientId),
          });
          queryClient.invalidateQueries({
            queryKey: noteKeys.detail(note.clientId, note.id),
          });
          toast.success("Note updated successfully");
          setOpen(false);
          setFiles([]);
        },
        onError: (error: Error) => {
          toast.error(`Error updating note: ${error.message}`);
        },
      },
    );
  };

  return (
    <>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          setOpen(true);
        }}>
        Edit
      </DropdownMenuItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update note details and attach PDFs.
            </DialogDescription>
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
                <FormLabel>Add PDF Documents</FormLabel>
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
                <Button type="submit" disabled={updateNoteMutation.isPending}>
                  {updateNoteMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
