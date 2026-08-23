import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppEnv = 'development' | 'staging' | 'homolog' | 'production';

const APP_ENV = (process.env.APP_ENV ??
  process.env.EXPO_PUBLIC_APP_ENV ??
  'development') as AppEnv;

const ENV = {
  development: {
    name: 'laweact-dev',
    scheme: 'laweact-dev',
    bundleIdentifier: 'com.laweact.app.dev',
    androidPackage: 'com.laweact.app.dev',
  },
  staging: {
    name: 'laweact-stg',
    scheme: 'laweact-staging',
    bundleIdentifier: 'com.laweact.app.staging',
    androidPackage: 'com.laweact.app.staging',
  },
  homolog: {
    name: 'laweact-hml',
    scheme: 'laweact-homolog',
    bundleIdentifier: 'com.laweact.app.homolog',
    androidPackage: 'com.laweact.app.homolog',
  },
  production: {
    name: 'laweact',
    scheme: 'laweact',
    bundleIdentifier: 'com.laweact.app',
    androidPackage: 'com.laweact.app',
  },
} as const satisfies Record<
  AppEnv,
  {
    name: string;
    scheme: string;
    bundleIdentifier: string;
    androidPackage: string;
  }
>;

const current = ENV[APP_ENV];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: current.name,
  slug: 'laweact',
  owner: 'laweact',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/android-app-icon.png',
  scheme: current.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/images/ios-app-icon.png',
    bundleIdentifier: current.bundleIdentifier,
    supportsTablet: true,
  },
  android: {
    icon: './assets/images/android-app-icon.png',
    adaptiveIcon: {
      backgroundColor: '#EE2E24',
      foregroundImage: './assets/images/android-app-icon.png',
    },
    predictiveBackGestureEnabled: false,
    package: current.androidPackage,
    permissions: ['android.permission.RECORD_AUDIO'],
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-dev-client',
      {
        toolsButton: false,
      },
    ],
    'expo-image',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2C2C2C',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    'expo-asset',
    'expo-secure-store',
    [
      'expo-image-picker',
      {
        photosPermission:
          'O Laweact precisa acessar suas fotos para anexar documentos e a imagem de perfil.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    router: {},
    appEnv: APP_ENV,
    eas: {
      projectId: '51eb8600-97f3-40bc-93cf-e493dd496d90',
    },
  },
});
