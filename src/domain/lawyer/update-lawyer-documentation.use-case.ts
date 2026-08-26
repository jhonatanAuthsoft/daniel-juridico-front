import {
  updateLawyerDocumentation,
  type UpdateLawyerDocumentationParams,
} from '@/data/lawyer';
import type { MeDetalheWire } from '@/data/auth';

export function updateLawyerDocumentationUseCase(
  params: UpdateLawyerDocumentationParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateLawyerDocumentation(params, signal);
}
