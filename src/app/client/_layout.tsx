import { Stack } from 'expo-router';

import { BrandColors } from '@/constants/theme';
import { RoleGuard, TermsGuard } from '@/domain/auth';

export default function ClientShellLayout() {
  return (
    <RoleGuard allowedRole="CLIENT">
      <TermsGuard>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: BrandColors.neutral.xdark },
          }}
        />
      </TermsGuard>
    </RoleGuard>
  );
}
