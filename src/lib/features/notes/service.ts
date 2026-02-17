import { api, type ApiError } from "@services/api";
import axios from "axios";
import type { FileNote, CreateFileNoteDto, UpdateFileNoteDto } from "./types";

export async function getNotes(clientId: string): Promise<FileNote[]> {
  try {
    const response = await api.get<FileNote[]>(`/clients/${clientId}/notes`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to fetch notes",
      );
    }
    throw error;
  }
}

export async function getNoteById(
  clientId: string,
  noteId: string,
): Promise<FileNote> {
  try {
    const response = await api.get<FileNote>(
      `/clients/${clientId}/notes/${noteId}`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to fetch note",
      );
    }
    throw error;
  }
}

export async function createNote(data: CreateFileNoteDto): Promise<FileNote> {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", data.type);

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => formData.append("files", file));
    }

    const response = await api.post<FileNote>(
      `/clients/${data.clientId}/notes`,
      formData,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to create note",
      );
    }
    throw error;
  }
}

export async function updateNote(data: UpdateFileNoteDto): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("type", data.type);

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => formData.append("files", file));
    }

    await api.post(`/clients/${data.clientId}/notes/${data.id}`, formData);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to update note",
      );
    }
    throw error;
  }
}

export async function getFileNoteDocumentDownloadUrl(
  clientId: string,
  noteId: string,
  documentId: string,
): Promise<string> {
  try {
    const response = await api.get<{ url: string }>(
      `/clients/${clientId}/notes/${noteId}/documents/${documentId}/download-url`,
    );
    return response.data.url;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to get document download URL",
      );
    }
    throw error;
  }
}
