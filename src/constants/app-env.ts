import Constants from 'expo-constants';

export type AppEnv = 'development' | 'staging' | 'homolog' | 'production';

export function getAppEnv(): AppEnv {
  const fromExtra = Constants.expoConfig?.extra?.appEnv;
  const fromPublic = process.env.EXPO_PUBLIC_APP_ENV;
  const value = (fromExtra ?? fromPublic ?? 'development') as string;

  if (
    value === 'staging' ||
    value === 'homolog' ||
    value === 'production' ||
    value === 'development'
  ) {
    return value;
  }

  return 'development';
}

export function isProductionApp(): boolean {
  return getAppEnv() === 'production';
}
