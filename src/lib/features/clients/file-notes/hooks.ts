import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFileNote,
  getFileNoteById,
  getFileNotes,
  updateFileNote,
} from "./service";
import type { CreateFileNoteDto, UpdateFileNoteDto } from "./types";
import { clientDocumentKeys } from "@clients/documents/hooks";

export const fileNoteKeys = {
  all: ["file-notes"] as const,
  lists: () => [...fileNoteKeys.all, "list"] as const,
  list: (clientId: string) => [...fileNoteKeys.lists(), clientId] as const,
  details: () => [...fileNoteKeys.all, "detail"] as const,
  detail: (clientId: string, noteId: string) =>
    [...fileNoteKeys.details(), clientId, noteId] as const,
};

export function useFileNotes(clientId: string) {
  return useQuery({
    queryKey: fileNoteKeys.list(clientId),
    queryFn: () => getFileNotes(clientId),
    enabled: !!clientId,
  });
}

export function useFileNote(clientId: string, noteId: string) {
  return useQuery({
    queryKey: fileNoteKeys.detail(clientId, noteId),
    queryFn: () => getFileNoteById(clientId, noteId),
    enabled: !!clientId && !!noteId,
  });
}

export function useCreateFileNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFileNoteDto) => createFileNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: fileNoteKeys.list(variables.clientId),
      });
      queryClient.invalidateQueries({
        queryKey: clientDocumentKeys.list(variables.clientId),
      });
    },
  });
}

export function useUpdateFileNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFileNoteDto) => updateFileNote(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: fileNoteKeys.list(variables.clientId),
      });
      queryClient.invalidateQueries({
        queryKey: fileNoteKeys.detail(variables.clientId, variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: clientDocumentKeys.list(variables.clientId),
      });
    },
  });
}
