import { Stack } from 'expo-router';

import { DevelopmentGuard } from '@/components/development-guard';
import { BrandColors } from '@/constants/theme';
import { RoleGuard, TermsGuard } from '@/domain/auth';

export default function LawyerShellLayout() {
  return (
    <RoleGuard allowedRole="LAWYER">
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
