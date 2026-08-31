import {
  mapOsToPushPlatform,
  mapPushDeviceWireToResult,
  mapRegisterPushDeviceParamsToWire,
  mapUnregisterPushDeviceParamsToWire,
} from './push-device.mapper';
import type { PushDeviceWire } from './push-device.types';

const sampleWire: PushDeviceWire = {
  id: 'dev-1',
  expoPushToken: 'ExponentPushToken[abc]',
  plataforma: 'IOS',
  ativo: true,
  ultimoRegistroEm: '2026-08-30T23:00:00',
};

describe('mapOsToPushPlatform', () => {
  it('maps native OS names to API platforms', () => {
    expect(mapOsToPushPlatform('ios')).toBe('IOS');
    expect(mapOsToPushPlatform('android')).toBe('ANDROID');
    expect(mapOsToPushPlatform('web')).toBe('WEB');
  });

  it('returns null for unknown OS', () => {
    expect(mapOsToPushPlatform('windows')).toBeNull();
  });
});

describe('mapRegisterPushDeviceParamsToWire', () => {
  it('maps token and platform to the POST body', () => {
    expect(
      mapRegisterPushDeviceParamsToWire({
        expoPushToken: 'ExponentPushToken[abc]',
        platform: 'ANDROID',
      }),
    ).toEqual({
      expoPushToken: 'ExponentPushToken[abc]',
      plataforma: 'ANDROID',
    });
  });
});

describe('mapUnregisterPushDeviceParamsToWire', () => {
  it('maps token to the DELETE body', () => {
    expect(
      mapUnregisterPushDeviceParamsToWire({
        expoPushToken: 'ExponentPushToken[abc]',
      }),
    ).toEqual({
      expoPushToken: 'ExponentPushToken[abc]',
    });
  });
});

describe('mapPushDeviceWireToResult', () => {
  it('maps wire fields to the domain result', () => {
    expect(mapPushDeviceWireToResult(sampleWire)).toEqual({
      id: 'dev-1',
      expoPushToken: 'ExponentPushToken[abc]',
      platform: 'IOS',
      active: true,
      lastRegisteredAt: '2026-08-30T23:00:00',
    });
  });
});
