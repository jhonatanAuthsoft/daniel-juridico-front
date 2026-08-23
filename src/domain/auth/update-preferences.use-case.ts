import { updatePreferences, type UpdatePreferencesParams } from '@/data/user';

export function updatePreferencesUseCase(
  params: UpdatePreferencesParams,
  signal?: AbortSignal,
) {
  return updatePreferences(params, signal);
}
