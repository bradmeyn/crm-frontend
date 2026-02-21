import type { ClientDocument } from "@clients/documents/types";

export interface FileNote {
  id: string;
  client: string;
  noteType: string;
  title: string;
  body: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  documents?: ClientDocument[];
}

export interface CreateFileNoteDto {
  clientId: string;
  noteType: string;
  title: string;
  body: string;
  isPrivate?: boolean;
  files?: File[];
}

export interface UpdateFileNoteDto {
  id: string;
  clientId: string;
  noteType: string;
  title: string;
  body: string;
  isPrivate?: boolean;
  files?: File[];
}
