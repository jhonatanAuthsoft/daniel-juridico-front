import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/atomic/button';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Display } from '@/atomic/typography';
import { roleLabel, useAuth } from '@/domain/auth';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    void signOut();
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
});
