import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MeResult } from '@/data/auth';
import type { UpdateProfilePhotoParams } from '@/data/user';

import { authKeys } from './auth.keys';
import { updateProfilePhotoUseCase } from './update-profile-photo.use-case';

/**
 * Domain hook: update profile photo (`PATCH /usuarios/me/foto`)
 * with optimistic update on `authKeys.me()`.
 */
export function useUpdateProfilePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateProfilePhotoParams) =>
      updateProfilePhotoUseCase(params),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: authKeys.me() });

      const previous = queryClient.getQueryData<MeResult>(authKeys.me());

      queryClient.setQueryData<MeResult>(authKeys.me(), (old) => {
        if (!old) {
          return {
            photoKey: params.photoKey,
            pushNotificationsEnabled: true,
            clientProfile: null,
            lawyerProfile: null,
          };
        }
        return {
          ...old,
          photoKey: params.photoKey,
        };
      });

      return { previous };
    },
    onError: (_error, _params, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(authKeys.me(), context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
