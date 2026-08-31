import type {
  PushDevicePlatform,
  PushDeviceResult,
  PushDeviceWire,
  RegisterPushDeviceParams,
  RegisterPushDeviceWireRequest,
  UnregisterPushDeviceParams,
  UnregisterPushDeviceWireRequest,
} from './push-device.types';

export function mapOsToPushPlatform(os: string): PushDevicePlatform | null {
  if (os === 'ios') {
    return 'IOS';
  }
  if (os === 'android') {
    return 'ANDROID';
  }
  if (os === 'web') {
    return 'WEB';
  }
  return null;
}

export function mapRegisterPushDeviceParamsToWire(
  params: RegisterPushDeviceParams,
): RegisterPushDeviceWireRequest {
  return {
    expoPushToken: params.expoPushToken.trim(),
    plataforma: params.platform,
  };
}

export function mapUnregisterPushDeviceParamsToWire(
  params: UnregisterPushDeviceParams,
): UnregisterPushDeviceWireRequest {
  return {
    expoPushToken: params.expoPushToken.trim(),
  };
}

export function mapPushDeviceWireToResult(wire: PushDeviceWire): PushDeviceResult {
  return {
    id: wire.id,
    expoPushToken: wire.expoPushToken,
    platform: wire.plataforma ?? null,
    active: Boolean(wire.ativo),
    lastRegisteredAt: wire.ultimoRegistroEm,
  };
}
