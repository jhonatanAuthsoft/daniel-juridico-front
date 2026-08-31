import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import {
  mapPushDeviceWireToResult,
  mapRegisterPushDeviceParamsToWire,
  mapUnregisterPushDeviceParamsToWire,
} from './push-device.mapper';
import type {
  PushDeviceResult,
  PushDeviceWire,
  RegisterPushDeviceParams,
  UnregisterPushDeviceParams,
} from './push-device.types';

/** `POST /dispositivos-push` */
export async function registerPushDevice(
  params: RegisterPushDeviceParams,
  signal?: AbortSignal,
): Promise<PushDeviceResult> {
  const response = await authenticatedHttpRequest<ApiResponse<PushDeviceWire>>(
    apiUrl('/dispositivos-push'),
    {
      method: 'POST',
      body: mapRegisterPushDeviceParamsToWire(params),
      signal,
    },
  );

  const data = assertApiSuccess(
    response,
    'Não foi possível registrar o dispositivo para notificações.',
  );
  return mapPushDeviceWireToResult(data);
}

/** `DELETE /dispositivos-push` */
export async function unregisterPushDevice(
  params: UnregisterPushDeviceParams,
  signal?: AbortSignal,
): Promise<void> {
  const response = await authenticatedHttpRequest<ApiResponse<PushDeviceWire>>(
    apiUrl('/dispositivos-push'),
    {
      method: 'DELETE',
      body: mapUnregisterPushDeviceParamsToWire(params),
      signal,
    },
  );

  assertApiSuccess(
    response,
    'Não foi possível remover o dispositivo de notificações.',
  );
}
