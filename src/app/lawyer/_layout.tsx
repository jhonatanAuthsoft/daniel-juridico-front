import { Stack } from 'expo-router';

import { RoleGuard } from '@/domain/auth';
import { BrandColors } from '@/constants/theme';

export default function LawyerShellLayout() {
  return (
    <RoleGuard allowedRole="LAWYER">
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: BrandColors.neutral.xdark },
        }}
      />
    </RoleGuard>
  );
}
