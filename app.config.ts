import type { ConfigContext, ExpoConfig } from 'expo/config';

type AppEnv = 'development' | 'staging' | 'production';

const APP_ENV = (process.env.APP_ENV ??
  process.env.EXPO_PUBLIC_APP_ENV ??
  'development') as AppEnv;

const ENV = {
  development: {
    name: 'laweact-dev',
    scheme: 'laweact-dev',
    bundleIdentifier: 'com.laweact.app.dev',
    androidPackage: 'com.laweact.app.dev',
    androidGoogleServicesFile: './files/android/google-services-dev.json',
    iosGoogleServicesFile: './files/ios/GoogleService-Info-dev.plist',
  },
  staging: {
    name: 'laweact-stg',
    scheme: 'laweact-staging',
    bundleIdentifier: 'com.laweact.app.staging',
    androidPackage: 'com.laweact.app.staging',
    androidGoogleServicesFile: './files/android/google-services-stg.json',
    iosGoogleServicesFile: './files/ios/GoogleService-Info-stg.plist',
  },
  production: {
    name: 'laweact',
    scheme: 'laweact',
    bundleIdentifier: 'com.laweact.app',
    androidPackage: 'com.laweact.app',
    androidGoogleServicesFile: './files/android/google-services.json',
    iosGoogleServicesFile: './files/ios/GoogleService-Info.plist',
  },
} as const satisfies Record<
  AppEnv,
  {
    name: string;
    scheme: string;
    bundleIdentifier: string;
    androidPackage: string;
    androidGoogleServicesFile: string;
    iosGoogleServicesFile: string;
  }
>;

const current =
  APP_ENV in ENV ? ENV[APP_ENV as AppEnv] : ENV.development;

/** Expo avalia app.config com cwd = raiz do app; evita __dirname (sem @types/node). */
function resolveGoogleServicesFile(relativePath: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { existsSync } = require('node:fs') as {
    existsSync: (path: string) => boolean;
  };
  const absolutePath = `${process.cwd()}/${relativePath.replace(/^\.\//, '')}`;
  return existsSync(absolutePath) ? relativePath : undefined;
}

const androidGoogleServicesFile = resolveGoogleServicesFile(
  current.androidGoogleServicesFile,
);
const iosGoogleServicesFile = resolveGoogleServicesFile(
  current.iosGoogleServicesFile,
);

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
    ...(iosGoogleServicesFile ? { googleServicesFile: iosGoogleServicesFile } : {}),
  },
  android: {
    icon: './assets/images/android-app-icon.png',
    adaptiveIcon: {
      backgroundColor: '#EE2E24',
      foregroundImage: './assets/images/android-app-icon.png',
    },
    predictiveBackGestureEnabled: false,
    package: current.androidPackage,
    ...(androidGoogleServicesFile
      ? { googleServicesFile: androidGoogleServicesFile }
      : {}),
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
    appEnv: APP_ENV in ENV ? APP_ENV : 'development',
    eas: {
      projectId: '51eb8600-97f3-40bc-93cf-e493dd496d90',
    },
  },
});
