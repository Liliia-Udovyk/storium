export interface Folder {
  id: number;
  name: string;
  parentId: number | null;
  folders: Folder[];
  files: StoredFile[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredFile {
  id: number;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  folderId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrumbItem {
  id: number;
  name: string;
}

export interface CreateFolderDto {
  name: string;
  parentId?: number | null;
}

export interface CreateFileDto {
  name: string;
  mimeType: string;
  size: number;
  url: string;
  folderId?: number | null;
}

export interface UploadFileDto {
  file: StoredFile | Blob;
  name: string;
  mimeType: string;
  size: number;
  folderId: number | null;
}
