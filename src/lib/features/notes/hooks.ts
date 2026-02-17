import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotes, getNoteById, createNote, updateNote } from "./service";
import type { CreateFileNoteDto, UpdateFileNoteDto } from "./types";

export const noteKeys = {
  all: ["notes"] as const,
  lists: () => [...noteKeys.all, "list"] as const,
  list: (clientId: string) => [...noteKeys.lists(), clientId] as const,
  details: () => [...noteKeys.all, "detail"] as const,
  detail: (clientId: string, noteId: string) =>
    [...noteKeys.details(), clientId, noteId] as const,
};

export function useNotes(clientId: string) {
  return useQuery({
    queryKey: noteKeys.list(clientId),
    queryFn: () => getNotes(clientId),
    enabled: !!clientId,
  });
}

export function useNote(clientId: string, noteId: string) {
  return useQuery({
    queryKey: noteKeys.detail(clientId, noteId),
    queryFn: () => getNoteById(clientId, noteId),
    enabled: !!clientId && !!noteId,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFileNoteDto) => createNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: noteKeys.list(variables.clientId),
      });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFileNoteDto) => updateNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: noteKeys.list(variables.clientId),
      });
      queryClient.invalidateQueries({
        queryKey: noteKeys.detail(variables.clientId, variables.id),
      });
    },
  });
}
