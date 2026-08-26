import {
  updateClientPersonalProfile,
  type UpdateClientPersonalProfileParams,
} from '@/data/client';
import type { MeDetalheWire } from '@/data/auth';

export function updateClientPersonalProfileUseCase(
  params: UpdateClientPersonalProfileParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateClientPersonalProfile(params, signal);
}
