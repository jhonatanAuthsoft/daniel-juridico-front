import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display } from '@/atomic/typography';
import {
  homeHrefForRole,
  roleLabel,
  useAuth,
  type UserRole,
} from '@/domain/auth';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

const ROLES: UserRole[] = ['CLIENT', 'LAWYER'];

export function ProfileScreen() {
  const router = useRouter();
  const { user, setRole, signOut } = useAuth();

  const switchRole = (role: UserRole) => {
    if (!user || user.role === role) {
      return;
    }

    setRole(role);
    router.replace(homeHrefForRole(role));
  };

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Display color={BrandColors.neutral.white}>Perfil</Display>
          <Separator size="sm" />
          <Body1 color={BrandColors.neutral.white}>{user?.name}</Body1>
          <Body2 color={BrandColors.neutral.light}>{user?.email}</Body2>
          <Separator size="xxs" />
          <Body2 color={BrandColors.primary.light}>
            Perfil atual: {user ? roleLabel(user.role) : '—'}
          </Body2>

          <Separator size="lg" />

          <Body1 color={BrandColors.neutral.white}>Mock — trocar perfil</Body1>
          <Separator size="sm" />
          <View style={styles.roleRow}>
            {ROLES.map((role) => {
              const active = user?.role === role;
              return (
                <Pressable
                  key={role}
                  onPress={() => switchRole(role)}
                  style={[styles.roleChip, active && styles.roleChipActive]}>
                  <Body2 color={active ? BrandColors.neutral.xdark : BrandColors.neutral.white}>
                    {roleLabel(role)}
                  </Body2>
                </Pressable>
              );
            })}
          </View>

          <Separator size="xl" />

          <Button variant="secondary" onPress={handleSignOut}>
            Sair da conta
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
  },
  roleChipActive: {
    backgroundColor: BrandColors.primary.light,
    borderColor: BrandColors.primary.light,
  },
});
