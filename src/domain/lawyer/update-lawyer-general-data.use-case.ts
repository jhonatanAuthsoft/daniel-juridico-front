import {
  updateLawyerGeneralData,
  type UpdateLawyerGeneralDataParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerGeneralDataUseCase(
  params: UpdateLawyerGeneralDataParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerGeneralData(params, signal);
}
