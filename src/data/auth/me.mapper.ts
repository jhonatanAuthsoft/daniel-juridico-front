import type { MeResult, MeWireResponse } from './me.types';

function normalizePhotoKey(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Maps `GET /usuarios/me` wire payload to the fields needed by profile UI.
 */
export function mapMeWireToResult(wire: MeWireResponse): MeResult {
  const photoKey =
    normalizePhotoKey(wire.cliente?.perfil?.fotoUrl) ??
    normalizePhotoKey(wire.advogado?.perfil?.fotoUrl);

  return {
    photoKey,
    pushNotificationsEnabled:
      wire.usuario?.notificacoesPushHabilitadas !== false,
  };
}
