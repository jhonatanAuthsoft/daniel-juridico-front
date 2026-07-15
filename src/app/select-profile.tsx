import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BagIcon } from '@/assets/icon/bag';
import { UserIcon } from '@/assets/icon/user';
import { Button } from '@/atomic/button';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { Display, Heading2 } from '@/atomic/typography';
import { BrandColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

const PROFILE_OPTION_HEIGHT = 72;

type ProfileOptionProps = {
  label: string;
  icon: ReactNode;
  onPress?: () => void;
};

function ProfileOption({ label, icon, onPress }: ProfileOptionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.optionShell, pressed && styles.optionPressed]}>
      <GlassBackground blurPx={25} />
      <View style={styles.optionContent}>
        {icon}
        <Heading2 color={BrandColors.neutral.white}>{label}</Heading2>
      </View>
    </Pressable>
  );
}

export default function SelectProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Separator size="xxxl" />

          <Display color={BrandColors.neutral.white} style={styles.title}>
            Escolha um perfil para continuar o cadastro
          </Display>

          <Separator size="lg" />

          <ProfileOption
            label="Preciso de um advogado"
            icon={<UserIcon color={BrandColors.neutral.xlight} />}
            onPress={() => router.push('/signup/client')}
          />

          <Separator size="sm" />

          <ProfileOption
            label="Sou advogado"
            icon={<BagIcon color={BrandColors.neutral.xlight} />}
            onPress={() => {}}
          />

          <Separator size="xxl" />

          <View style={styles.footer}>
            <Button variant="link" href="/login" linkMode="navigation">
              Já tem conta? Entrar
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const glassShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
  },
  optionShell: {
    height: PROFILE_OPTION_HEIGHT,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
  },
  optionPressed: {
    opacity: 0.88,
  },
  optionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  footer: {
    alignItems: 'center',
  },
});
