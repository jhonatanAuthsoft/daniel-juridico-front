import {
  apiUrl,
  assertApiSuccess,
  authenticatedHttpRequest,
  type ApiResponse,
} from '@/data/http';

import { mapSubscriptionWireToResult } from './subscription.mapper';
import type {
  SubscriptionResult,
  SubscriptionWire,
  ValidateSubscriptionParams,
} from './subscription.types';

/** `GET /assinaturas/me` */
export async function getMySubscription(signal?: AbortSignal): Promise<SubscriptionResult> {
  const response = await authenticatedHttpRequest<ApiResponse<SubscriptionWire>>(
    apiUrl('/assinaturas/me'),
    { method: 'GET', signal },
  );

  const data = assertApiSuccess(response, 'Não foi possível carregar a assinatura.');
  return mapSubscriptionWireToResult(data);
}

/** `POST /assinaturas/validar` */
export async function validateSubscription(
  params: ValidateSubscriptionParams,
  signal?: AbortSignal,
): Promise<SubscriptionResult> {
  const response = await authenticatedHttpRequest<ApiResponse<SubscriptionWire>>(
    apiUrl('/assinaturas/validar'),
    {
      method: 'POST',
      body: {
        plataforma: params.platform,
        productId: params.productId,
        purchaseToken: params.purchaseToken,
      },
      signal,
    },
  );

  const data = assertApiSuccess(response, 'Não foi possível validar a assinatura.');
  return mapSubscriptionWireToResult(data);
}
