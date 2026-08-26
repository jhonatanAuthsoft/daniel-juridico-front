import { Stack } from 'expo-router';

import { BrandColors } from '@/constants/theme';

export default function LawyerPerfilStackLayout() {
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
