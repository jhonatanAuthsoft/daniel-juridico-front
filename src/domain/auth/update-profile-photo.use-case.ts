import { updateProfilePhoto, type UpdateProfilePhotoParams } from '@/data/user';

export function updateProfilePhotoUseCase(
  params: UpdateProfilePhotoParams,
  signal?: AbortSignal,
) {
  return updateProfilePhoto(params, signal);
}
