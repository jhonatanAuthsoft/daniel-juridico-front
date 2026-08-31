export type PushDevicePlatform = 'IOS' | 'ANDROID' | 'WEB';

export type RegisterPushDeviceParams = {
  expoPushToken: string;
  platform: PushDevicePlatform;
};

export type UnregisterPushDeviceParams = {
  expoPushToken: string;
};

export type RegisterPushDeviceWireRequest = {
  expoPushToken: string;
  plataforma: PushDevicePlatform;
};

export type UnregisterPushDeviceWireRequest = {
  expoPushToken: string;
};

export type PushDeviceWire = {
  id: string;
  expoPushToken: string;
  plataforma?: PushDevicePlatform | null;
  ativo: boolean;
  ultimoRegistroEm: string;
};

export type PushDeviceResult = {
  id: string;
  expoPushToken: string;
  platform: PushDevicePlatform | null;
  active: boolean;
  lastRegisteredAt: string;
};
