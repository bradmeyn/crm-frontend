import { api, type ApiError } from "@services/api";
import axios from "axios";
import type { ClientDocument, UploadClientDocumentDto } from "./types";

export async function getClientDocuments(
  clientId: string,
): Promise<ClientDocument[]> {
  try {
    const response = await api.get<ClientDocument[]>(
      `/clients/${clientId}/documents/`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to fetch documents",
      );
    }
    throw error;
  }
}

export async function uploadClientDocument({
  clientId,
  file,
  category,
  description,
  fileNote,
}: UploadClientDocumentDto): Promise<ClientDocument> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category ?? "OTHER");

    if (description) {
      formData.append("description", description);
    }

    if (fileNote) {
      formData.append("fileNote", fileNote);
    }

    const response = await api.post<ClientDocument>(
      `/clients/${clientId}/documents/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to upload document",
      );
    }
    throw error;
  }
}

export async function deleteClientDocument(
  clientId: string,
  documentId: string,
): Promise<void> {
  try {
    await api.delete(`/clients/${clientId}/documents/${documentId}/`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to delete document",
      );
    }
    throw error;
  }
}
