import { Stack } from 'expo-router';

import { BrandColors } from '@/constants/theme';

export default function ClientPerfilStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        freezeOnBlur: false,
        contentStyle: { backgroundColor: BrandColors.neutral.xdark },
      }}
    />
  );
}
