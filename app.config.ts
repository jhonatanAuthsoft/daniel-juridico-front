import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppEnv = 'development' | 'staging' | 'production';

const APP_ENV = (process.env.APP_ENV ??
  process.env.EXPO_PUBLIC_APP_ENV ??
  'development') as AppEnv;

const ENV = {
  development: {
    name: 'Laweact Dev',
    scheme: 'laweact-dev',
    bundleIdentifier: 'com.laweact.app.dev',
    androidPackage: 'com.laweact.app.dev',
  },
  staging: {
    name: 'Laweact Staging',
    scheme: 'laweact-staging',
    bundleIdentifier: 'com.laweact.app.staging',
    androidPackage: 'com.laweact.app.staging',
  },
  production: {
    name: 'Laweact',
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
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: current.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/expo.icon',
    bundleIdentifier: current.bundleIdentifier,
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
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
    'expo-dev-client',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#EE2E24',
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
      projectId: '0f752743-4881-4980-b51b-797522cb6793',
    },
  },
});
