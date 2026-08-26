import {
  updateLawyerBilling,
  type UpdateLawyerBillingParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerBillingUseCase(
  params: UpdateLawyerBillingParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerBilling(params, signal);
}
