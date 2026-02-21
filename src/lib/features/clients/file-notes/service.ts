import { api, type ApiError } from "@services/api";
import axios from "axios";
import type { CreateFileNoteDto, FileNote, UpdateFileNoteDto } from "./types";
import { uploadClientDocument } from "@clients/documents/service";

export async function getFileNotes(clientId: string): Promise<FileNote[]> {
  try {
    const response = await api.get<FileNote[]>(
      `/clients/${clientId}/file-notes/`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data as ApiError;
      throw new Error(
        errorData?.error ||
          errorData?.message ||
          errorData?.errors?.join(", ") ||
          "Failed to fetch file notes",
      );
    }
    throw error;
  }
}

export async function getFileNoteById(
  clientId: string,
  noteId: string,
): Promise<FileNote> {
  try {
    const response = await api.get<FileNote>(
      `/clients/${clientId}/file-notes/${noteId}/`,
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

export async function createFileNote(
  data: CreateFileNoteDto,
): Promise<FileNote> {
  try {
    const response = await api.post<FileNote>(
      `/clients/${data.clientId}/file-notes/`,
      {
        title: data.title,
        body: data.body,
        noteType: data.noteType,
        isPrivate: data.isPrivate ?? false,
      },
    );

    if (data.files && data.files.length > 0) {
      await Promise.all(
        data.files.map((file) =>
          uploadClientDocument({
            clientId: data.clientId,
            file,
            fileNote: response.data.id,
          }),
        ),
      );
    }

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

export async function updateFileNote(
  data: UpdateFileNoteDto,
): Promise<boolean> {
  try {
    await api.patch(`/clients/${data.clientId}/file-notes/${data.id}/`, {
      title: data.title,
      body: data.body,
      noteType: data.noteType,
      isPrivate: data.isPrivate ?? false,
    });

    if (data.files && data.files.length > 0) {
      await Promise.all(
        data.files.map((file) =>
          uploadClientDocument({
            clientId: data.clientId,
            file,
            fileNote: data.id,
          }),
        ),
      );
    }

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
