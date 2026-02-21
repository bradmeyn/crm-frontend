export interface ClientDocument {
  id: string;
  client: string;
  fileNote?: string | null;
  file: string;
  name: string;
  size: number;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface UploadClientDocumentDto {
  clientId: string;
  file: File;
  category?: string;
  description?: string;
  fileNote?: string;
}
