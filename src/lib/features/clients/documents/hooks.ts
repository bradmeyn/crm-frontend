import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteClientDocument,
  getClientDocuments,
  uploadClientDocument,
} from "./service";

export const clientDocumentKeys = {
  all: ["clientDocuments"] as const,
  lists: () => [...clientDocumentKeys.all, "list"] as const,
  list: (clientId: string) =>
    [...clientDocumentKeys.lists(), clientId] as const,
};

export function useClientDocuments(clientId: string) {
  return useQuery({
    queryKey: clientDocumentKeys.list(clientId),
    queryFn: () => getClientDocuments(clientId),
    enabled: !!clientId,
  });
}

export function useUploadClientDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadClientDocument,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: clientDocumentKeys.list(variables.clientId),
      });
      queryClient.invalidateQueries({
        queryKey: ["file-notes"],
      });
    },
  });
}

export function useDeleteClientDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      clientId,
      documentId,
    }: {
      clientId: string;
      documentId: string;
    }) => deleteClientDocument(clientId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: clientDocumentKeys.list(variables.clientId),
      });
      queryClient.invalidateQueries({
        queryKey: ["file-notes"],
      });
    },
  });
}
