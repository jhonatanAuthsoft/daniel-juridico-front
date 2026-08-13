import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { BrandColors } from '@/constants/theme';
import { RoleGuard, TermsGuard } from '@/domain/auth';

export default function LawyerShellLayout() {
  return (
    <RoleGuard allowedRole="LAWYER">
      <TermsGuard>
        <Stack
          detachInactiveScreens={Platform.OS !== 'android'}
          screenOptions={{
            headerShown: false,
            animation: 'none',
            freezeOnBlur: false,
            contentStyle: { backgroundColor: BrandColors.neutral.xdark },
          }}
        />
      </TermsGuard>
    </RoleGuard>
  );
}
