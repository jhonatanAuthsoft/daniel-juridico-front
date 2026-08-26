import {
  updateLawyerGraduation,
  type UpdateLawyerGraduationParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerGraduationUseCase(
  params: UpdateLawyerGraduationParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerGraduation(params, signal);
}
