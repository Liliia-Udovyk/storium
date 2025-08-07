import { useCallback } from 'react';

import { useRootFolders, useFolder } from '@/utils/queries/folder';
import { useRootFiles } from '@/utils/queries/file';

export function useFolderContent(folderId: number | null) {
  const isRoot = folderId === null;

  const {
    folders,
    isLoading: foldersLoading,
    isError: foldersError,
    refresh: refreshFolders,
  } = useRootFolders();

  const {
    files,
    isLoading: filesLoading,
    isError: filesError,
    refresh: refreshFiles,
  } = useRootFiles();

  const {
    folder,
    isLoading: folderLoading,
    isError: folderError,
    refresh: refreshFolder,
  } = useFolder(folderId);

  const loading = isRoot
    ? foldersLoading || filesLoading
    : folderLoading;

  const errors = isRoot
    ? { folders: foldersError, files: filesError, folder: null }
    : { folders: folderError, files: folderError, folder: folderError };

  const refreshAll = useCallback(() => {
    if (isRoot) {
      refreshFolders();
      refreshFiles();
    } else {
      refreshFolder();
    }
  }, [isRoot, refreshFolders, refreshFiles, refreshFolder]);

  return {
    folder: isRoot ? null : folder,
    folders: isRoot ? folders : folder?.folders || [],
    files: isRoot ? files : folder?.files || [],
    loading,
    errors,
    refreshAll,
  };
}
