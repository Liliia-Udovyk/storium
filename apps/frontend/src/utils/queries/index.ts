import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { AxiosError } from 'axios';
import useSWRMutation from 'swr/mutation';
import { toast } from 'sonner';

import { http } from '../axios';
import { Folder, StoredFile, BreadcrumbItem, CreateFolderDto, CreateFileDto } from '@/interfaces';

const fetcher = <T>(url: string) =>
  http<T>({ url }).then(res => res.data);

export const useGetFolders = (parentId: number | null) => {
  const url = parentId === null ? '/folders?parent=null' : `/folders?parent=${parentId}`;
  const { data, error, mutate } = useSWR<Folder[]>(url, fetcher);

  const revalidate = useCallback(() => mutate(), [mutate]);

  return {
    folders: data || [],
    isLoading: !error && !data,
    isError: error,
    revalidate,
  };
};

export const useGetFiles = (folderId: number | null) => {
  const url = folderId === null ? '/files?folder=null' : `/files?folder=${folderId}`;
  const { data, error, mutate } = useSWR<StoredFile[]>(url, fetcher);

  const revalidate = useCallback(() => mutate(), [mutate]);

  return {
    files: data || [],
    isLoading: !error && !data,
    isError: error,
    revalidate,
  };
};

export const useFolder = (folderId?: number | null) => {
  const key = folderId === null ? '/folders?parentId=null' : folderId ? `/folders/${folderId}` : null;

  const { data, error, mutate } = useSWR<Folder>(
    key,
    () => http<Folder>({ url: key! }).then(res => res.data)
  );

  return {
    folder: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const useRootFolders = () => {
  const { data, error, mutate } = useSWR<Folder[]>('/folders?parentId=null', () =>
    http<Folder[]>({ url: '/folders?parentId=null' }).then(res => res.data)
  );
  console.log('🚀 ~ useRootFolders ~ data:', data);

  return {
    folders: data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export function useFolderBreadcrumb(folderId?: number | null) {
  const shouldFetch = folderId !== undefined && folderId !== null;

  const { data, error } = useSWR<BreadcrumbItem[]>(
    shouldFetch ? `/folders/${folderId}/breadcrumb` : null,
    async (url: string) => {
      const res = await http<{ data: BreadcrumbItem[] }>({ url });
      return res.data.data;
    }
  );

  return {
    breadcrumbs: data || [],
    isLoading: !error,
    isError: error,
  };
}

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
      const message = err?.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading, error };
};
