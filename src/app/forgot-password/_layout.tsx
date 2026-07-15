import { Stack } from 'expo-router';

import { BrandColors } from '@/constants/theme';

export default function ForgotPasswordLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BrandColors.neutral.xdark },
      }}
    />
  );
}
