import {
  updateClientAddress,
  type UpdateClientAddressParams,
} from '@/data/client';
import type { MeDetalheWire } from '@/data/auth';

export function updateClientAddressUseCase(
  params: UpdateClientAddressParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateClientAddress(params, signal);
}
