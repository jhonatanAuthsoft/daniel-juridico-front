import { logScreenAccess, type LogScreenAccessParams } from '@/data/user';

export function logScreenAccessUseCase(
  params: LogScreenAccessParams,
  signal?: AbortSignal,
) {
  return logScreenAccess(params, signal);
}
