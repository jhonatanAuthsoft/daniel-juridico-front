import { Stack } from 'expo-router';

import { DevelopmentGuard } from '@/components/development-guard';
import { BrandColors } from '@/constants/theme';
import { RoleGuard, TermsGuard } from '@/domain/auth';

export default function ClientShellLayout() {
  return (
    <RoleGuard allowedRole="CLIENT">
      <TermsGuard>
        <DevelopmentGuard>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: BrandColors.neutral.xdark },
            }}
          />
        </DevelopmentGuard>
      </TermsGuard>
    </RoleGuard>
  );
}
