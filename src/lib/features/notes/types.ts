export interface FileNoteDocument {
  id: string;
  fileName: string;
  blobName: string;
  contentType: string;
  fileSize: number;
  fileNoteId: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
}

export interface FileNote {
  id: string;
  type: string;
  title: string;
  content: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  updatedById: string;
  documents?: FileNoteDocument[];
}

export interface CreateFileNoteDto {
  clientId: string;
  type: string;
  title: string;
  content: string;
  files?: File[];
}

export interface UpdateFileNoteDto {
  id: string;
  clientId: string;
  type: string;
  title: string;
  content: string;
  files?: File[];
}
