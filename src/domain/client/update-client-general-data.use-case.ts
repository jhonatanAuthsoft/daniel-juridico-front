import {
  updateClientGeneralData,
  type UpdateClientGeneralDataParams,
} from '@/data/client';
import type { MeDetalheWire } from '@/data/auth';

export function updateClientGeneralDataUseCase(
  params: UpdateClientGeneralDataParams,
  signal?: AbortSignal,
): Promise<MeDetalheWire> {
  return updateClientGeneralData(params, signal);
}
