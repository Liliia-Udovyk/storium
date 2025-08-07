import { useState } from 'react';
import useSWR from 'swr';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { StoredFile, UpdateFileDto } from '@/interfaces';
import { http } from '../axios';
import { fetcher } from '../helpers';

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

export const updateFile = (fileId: number, data: UpdateFileDto) =>
  http<StoredFile>({
    url: `/files/${fileId}`,
    method: 'PATCH',
    data,
  });

export const cloneFile = (fileId: number, folderId?: number | null) => {
  const url = folderId
    ? `/files/${fileId}/clone?folderId=${folderId}`
    : `/files/${fileId}/clone`;
  return http<StoredFile>({
    url,
    method: 'POST',
  });
};

export const deleteFile = (id: number) =>
  http({ url: `/files/${id}`, method: 'DELETE' });

export const useSearchFiles = (name: string | null) => {
  const { data, error, mutate } = useSWR<StoredFile[]>(
    name ? `/files/actions/search?name=${encodeURIComponent(name)}` : null,
    fetcher
  );

  return {
    files: data || [],
    isLoading: !data && !error,
    isError: error,
    refresh: mutate,
  };
};
