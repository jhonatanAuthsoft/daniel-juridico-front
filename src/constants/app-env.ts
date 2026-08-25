import Constants from 'expo-constants';

export type AppEnv = 'development' | 'staging' | 'production';

export function getAppEnv(): AppEnv {
  const fromExtra = Constants.expoConfig?.extra?.appEnv;
  const fromPublic = process.env.EXPO_PUBLIC_APP_ENV;
  const value = (fromExtra ?? fromPublic ?? 'development') as string;

  if (
    value === 'staging' ||
    value === 'production' ||
    value === 'development'
  ) {
    return value;
  }

  // Legacy alias: homolog was collapsed into staging.
  if (value === 'homolog') {
    return 'staging';
  }

  return 'development';
}

export function isProductionApp(): boolean {
  return getAppEnv() === 'production';
}
