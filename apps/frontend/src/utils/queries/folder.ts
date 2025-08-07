import useSWR from 'swr';

import { http } from '../axios';
import { Folder, BreadcrumbItem, CreateFolderDto, UpdateFolderDto } from '@/interfaces';
import { fetcher } from '../helpers';

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

export const createFolder = (data: CreateFolderDto) =>
  http({ url: '/folders', method: 'POST', data });

export const updateFolder = (id: number, data: UpdateFolderDto) =>
  http<Folder>({ url: `/folders/${id}`, method: 'PATCH', data }).then(res => res.data);

export const cloneFolder = (id: number) =>
  http<Folder>({ url: `/folders/${id}/clone`, method: 'POST' }).then(res => res.data);

export const deleteFolder = (id: number) =>
  http({ url: `/folders/${id}`, method: 'DELETE' });

export const useSearchFolders = (name: string | null) => {
  const { data, error, mutate } = useSWR<Folder[]>(
    name ? `/folders/search?name=${encodeURIComponent(name)}` : null,
    fetcher
  );

  return {
    folders: data || [],
    isLoading: !data && !error,
    isError: error,
    refresh: mutate,
  };
};
