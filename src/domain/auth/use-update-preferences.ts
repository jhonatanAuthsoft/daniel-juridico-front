import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { MeResult } from '@/data/auth';
import type { UpdatePreferencesParams } from '@/data/user';

import { authKeys } from './auth.keys';
import { updatePreferencesUseCase } from './update-preferences.use-case';

/**
 * Domain hook: update push preference (`PATCH /usuarios/me/preferencias`)
 * with optimistic update on `authKeys.me()`.
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdatePreferencesParams) =>
      updatePreferencesUseCase(params),
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: authKeys.me() });

      const previous = queryClient.getQueryData<MeResult>(authKeys.me());

      queryClient.setQueryData<MeResult>(authKeys.me(), (old) => {
        if (!old) {
          return {
            photoKey: null,
            pushNotificationsEnabled: params.pushNotificationsEnabled,
          };
        }
        return {
          ...old,
          pushNotificationsEnabled: params.pushNotificationsEnabled,
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
