import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { http } from '@/utils/axios';

export const useUploadFile = () => {
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
