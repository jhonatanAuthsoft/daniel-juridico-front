import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { SplashGuard } from '@/components/splash-guard';
import { BrandColors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SplashGuard>
        <Stack
          initialRouteName="login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: BrandColors.neutral.xdark },
            animation: 'none',
          }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="index" />
          <Stack.Screen name="select-profile" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SplashGuard>
    </ThemeProvider>
  );
}
