import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (notificationId: string) => apiClient.patch(`/notifications/${notificationId}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications']);
      },
    }
  );

  return mutation;
};
