import { Stack } from 'expo-router';

import { BrandColors } from '@/constants/theme';

export default function SignupLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: BrandColors.neutral.xdark },
      }}
    />
  );
}
