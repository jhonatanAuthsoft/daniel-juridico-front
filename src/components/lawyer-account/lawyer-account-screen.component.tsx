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

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { Body1, Body2, Display, Link } from '@/atomic/typography';
import { AccountProfilePhoto } from '@/components/profile-avatar';
import { useAuth, useMe, useUpdatePreferences } from '@/domain/auth';
import {
  BrandColors,
  MaxContentWidth,
  Radius,
  Spacing,
} from '@/constants/theme';

const MENU_ITEMS = [
  'Editar Dados',
  'Alterar Senha',
  'Assinatura e plano',
  'Termos e condições',
  'Suporte',
] as const;

const TAB_BAR_CONTENT_HEIGHT = 62;
const LIST_GAP_ABOVE_TAB = 16;

type SettingToggleProps = {
  label: string;
  description: string;
  value: boolean;
  disabled?: boolean;
  onValueChange: (value: boolean) => void;
};

function SettingToggle({
  label,
  description,
  value,
  disabled,
  onValueChange,
}: SettingToggleProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingCopy}>
        <Body1 color={BrandColors.neutral.white}>{label}</Body1>
        <Body2 color={BrandColors.neutral.light}>{description}</Body2>
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityRole="switch"
        disabled={disabled}
        trackColor={{
          false: BrandColors.neutral.dark,
          true: BrandColors.primary.light,
        }}
        thumbColor={BrandColors.neutral.white}
        ios_backgroundColor={BrandColors.neutral.dark}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
}

export function LawyerAccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { data: me } = useMe();
  const updatePreferences = useUpdatePreferences();
  const notificationsEnabled = me?.pushNotificationsEnabled ?? true;
  const [profileUnavailable, setProfileUnavailable] = useState(true);
  const contentPaddingBottom =
    TAB_BAR_CONTENT_HEIGHT + insets.bottom + LIST_GAP_ABOVE_TAB;

  const handleSignOut = () => {
    void signOut();
    router.replace('/login');
  };

  const handleNotificationsChange = (value: boolean) => {
    updatePreferences.mutate({ pushNotificationsEnabled: value });
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
          <AccountProfilePhoto />
          <Body1 color={BrandColors.neutral.white} style={styles.name}>
            {user?.name ?? 'Luiza Bittencourt'}
          </Body1>
          <Body2 color={BrandColors.neutral.light}>
            {user?.email ?? 'luizabitt@gmail.com'}
          </Body2>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item}
              accessibilityLabel={item}
              accessibilityRole="button"
              onPress={() => {
                if (item === 'Editar Dados') {
                  router.push('/lawyer/perfil/editar-dados');
                  return;
                }
                if (item === 'Alterar Senha') {
                  router.push('/lawyer/perfil/alterar-senha');
                  return;
                }
                if (item === 'Termos e condições') {
                  router.push('/lawyer/perfil/termos');
                }
              }}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.pressed,
              ]}>
              <Body1 color={BrandColors.neutral.white} style={styles.menuLabel}>
                {item}
              </Body1>
              <CaretLeftIcon
                color={BrandColors.neutral.white}
                direction="right"
                width={20}
                height={20}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.settings}>
          <SettingToggle
            description="Permite que o aplicativo envie notificações para você"
            disabled={updatePreferences.isPending}
            label="Notificações"
            onValueChange={handleNotificationsChange}
            value={notificationsEnabled}
          />
          <SettingToggle
            description="Você deixará de receber notificações de urgência e emergência"
            label="Tornar Perfil indisponível"
            onValueChange={setProfileUnavailable}
            value={profileUnavailable}
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
  settings: {
    gap: Spacing.md,
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
