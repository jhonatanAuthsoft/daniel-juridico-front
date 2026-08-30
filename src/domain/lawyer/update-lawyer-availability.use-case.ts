import {
  updateLawyerAvailability,
  type UpdateLawyerAvailabilityParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerAvailabilityUseCase(
  params: UpdateLawyerAvailabilityParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerAvailability(params, signal);
}
