import { Stack } from 'expo-router';

import { RoleGuard } from '@/domain/auth';
import { BrandColors } from '@/constants/theme';

export default function ClientShellLayout() {
  return (
    <RoleGuard allowedRole="CLIENT">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BrandColors.neutral.xdark },
        }}
      />
    </RoleGuard>
  );
}
