import { Stack } from 'expo-router';

import { BrandColors } from '@/constants/theme';
import { GuestGuard } from '@/domain/auth';

export default function ForgotPasswordLayout() {
  return (
    <GuestGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BrandColors.neutral.xdark },
        }}
      />
    </GuestGuard>
  );
}
