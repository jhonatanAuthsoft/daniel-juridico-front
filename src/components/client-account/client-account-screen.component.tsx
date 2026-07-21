import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChevronRightIcon } from '@/assets/icon/chevron-right';
import { Body1, Body2, Display, Link } from '@/atomic/typography';
import { useAuth } from '@/domain/auth';
import {
  BrandColors,
  MaxContentWidth,
  Radius,
  Spacing,
} from '@/constants/theme';

const MENU_ITEMS = [
  'Editar Dados',
  'Alterar Senha',
  'Termos e condições',
] as const;

const TAB_BAR_CONTENT_HEIGHT = 62;
const LIST_GAP_ABOVE_TAB = 16;

export function ClientAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const contentPaddingBottom =
    TAB_BAR_CONTENT_HEIGHT + insets.bottom + LIST_GAP_ABOVE_TAB;

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: contentPaddingBottom,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <Display color={BrandColors.neutral.white}>Conta</Display>

        <View style={styles.identity}>
          <View style={styles.avatarWrap}>
            <Image
              testID="profile-image"
              source={require('@/assets/images/profile.png')}
              contentFit="cover"
              style={styles.avatar}
            />
            <Pressable
              accessibilityLabel="Editar foto de perfil"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.editAvatar,
                pressed && styles.pressed,
              ]}>
              <SymbolView
                name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                size={16}
                tintColor={BrandColors.neutral.white}
              />
            </Pressable>
          </View>
          <Body1 color={BrandColors.neutral.white} style={styles.name}>
            {user?.name ?? 'Maria Silva Lima'}
          </Body1>
          <Body2 color={BrandColors.neutral.light}>
            {user?.email ?? 'maria_silvalima@gmail.com'}
          </Body2>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item}
              accessibilityLabel={item}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.pressed,
              ]}>
              <Body1 color={BrandColors.neutral.white} style={styles.menuLabel}>
                {item}
              </Body1>
              <ChevronRightIcon
                color={BrandColors.neutral.white}
                width={20}
                height={20}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingCopy}>
            <Body1 color={BrandColors.neutral.white}>Notificações</Body1>
            <Body2 color={BrandColors.neutral.light}>
              Permite que o aplicativo envie notificações para você
            </Body2>
          </View>
          <Switch
            accessibilityLabel="Notificações"
            accessibilityRole="switch"
            trackColor={{
              false: BrandColors.neutral.dark,
              true: BrandColors.primary.light,
            }}
            thumbColor={BrandColors.neutral.white}
            ios_backgroundColor={BrandColors.neutral.dark}
            onValueChange={setNotificationsEnabled}
            value={notificationsEnabled}
          />
        </View>

        <Pressable
          accessibilityLabel="Sair da conta"
          accessibilityRole="button"
          onPress={handleSignOut}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{
              ios: 'rectangle.portrait.and.arrow.right',
              android: 'logout',
              web: 'logout',
            }}
            size={20}
            tintColor={BrandColors.feedback.error.medium}
          />
          <Link color={BrandColors.feedback.error.medium} numberOfLines={1}>
            Sair da conta
          </Link>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  identity: {
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  avatarWrap: {
    width: 128,
    height: 128,
    marginBottom: Spacing.xxs,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: BrandColors.neutral.dark,
  },
  editAvatar: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.neutral.dark,
  },
  name: {
    textAlign: 'center',
  },
  menu: {
    gap: Spacing.xs,
  },
  menuItem: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  menuLabel: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.neutral.medium,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingCopy: {
    flex: 1,
    gap: Spacing.xxxs,
  },
  logoutButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
    borderWidth: 1.5,
    borderColor: BrandColors.feedback.error.medium,
    borderRadius: Radius.large,
  },
  pressed: {
    opacity: 0.75,
  },
});
