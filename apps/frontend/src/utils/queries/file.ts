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
