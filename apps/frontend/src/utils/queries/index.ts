import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { AxiosError } from 'axios';
import useSWRMutation from 'swr/mutation';
import { toast } from 'sonner';

import { http } from '../axios';
import { Folder, StoredFile, BreadcrumbItem, CreateFolderDto, CreateFileDto } from '@/interfaces';

const fetcher = <T>(url: string) =>
  http<T>({ url }).then(res => res.data);

export const useFolder = (folderId: number | null) => {
  const { data, error, mutate } = useSWR<Folder>(
    folderId ? `/folders/${folderId}` : null,
    fetcher
  );

  return {
    folder: data,
    isLoading: !data && !error,
    isError: error,
    refresh: mutate,
  };
};

export const useRootFolders = () => {
  const { data, error, mutate } = useSWR<Folder[]>(
    '/folders?parent=null',
    fetcher
  );

  return {
    folders: data || [],
    isLoading: !data && !error,
    isError: error,
    refresh: mutate,
  };
};

export const useRootFiles = () => {
  const { data, error, mutate } = useSWR<StoredFile[]>(
    '/files?folder=null',
    fetcher
  );

  return {
    files: data || [],
    isLoading: !data && !error,
    isError: error,
    refresh: mutate,
  };
};

export const useFolderBreadcrumb = (folderId?: number | null) => {
  const { data, error } = useSWR<BreadcrumbItem[]>(
    folderId ? `/folders/${folderId}/breadcrumb` : null,
    fetcher
  );

  return {
    breadcrumbs: data || [],
    isLoading: !data && !error,
    isError: error,
  };
};

export const useCreateFolder = () => {
  const create = async (data: CreateFolderDto) => {
    return http({ url: '/folders', method: 'POST', data });
  };

  return { create };
};

export const useCreateFile = () => {
  const create = async (data: CreateFileDto) => {
    return http({ url: '/files', method: 'POST', data });
  };

  return { create };
};

export function useCreateFolderMutation() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/folders',
    (url, { arg }: { arg: CreateFolderDto }) =>
      http<Folder>({
        url,
        method: 'POST',
        data: arg,
      }).then(res => res.data),
  );

  const createFolder = useCallback(
    (data: CreateFolderDto) => trigger(data),
    [trigger],
  );

  return {
    createFolder,
    isLoading: isMutating,
    error,
  };
}

export const useUploadFileMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async ({
    file,
    folderId = null,
  }: {
    file: File;
    folderId: number | null;
  }) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (folderId !== null) {
      formData.append('folderId', String(folderId));
    }

    try {
      await http({
        url: '/files',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const message = err?.response?.data?.message || 'Failed to upload file';
      toast.error(message);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};
