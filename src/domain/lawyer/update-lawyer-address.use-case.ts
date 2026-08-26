import {
  updateLawyerAddress,
  type UpdateLawyerAddressParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerAddressUseCase(
  params: UpdateLawyerAddressParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerAddress(params, signal);
}
