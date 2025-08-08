import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { http } from '@/utils/axios';

export const useLogout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await http({
        url: '/auth/logout',
        method: 'POST',
        withCredentials: true,
      });
      toast.success('Logged out successfully');
      router.push('/auth');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const message = axiosError?.response?.data?.message || 'Failed to logout';
      toast.error(message);
      setError(axiosError);
      throw axiosError;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};
