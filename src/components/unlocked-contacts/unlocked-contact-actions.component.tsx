import { useState } from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Body1 } from '@/atomic/typography';
import { BrandColors, Spacing } from '@/constants/theme';
import {
  buildMailtoUrl,
  buildSmsUrl,
  buildTelUrl,
  buildWhatsAppUrl,
} from '@/utils/contact-links';

import { PhoneContactMenu } from './phone-contact-menu.component';

type UnlockedContactActionsProps = {
  phone: string;
  email: string;
  iconSize?: number;
};

function openContactUrl(url: string | null) {
  if (!url) {
    return;
  }
  void Linking.openURL(url);
}

export function UnlockedContactActions({
  phone,
  email,
  iconSize = 24,
}: UnlockedContactActionsProps) {
  const [phoneMenuOpen, setPhoneMenuOpen] = useState(false);
  const phoneLabel = phone.trim() || 'Não informado';
  const emailLabel = email.trim() || 'Não informado';
  const mailtoUrl = buildMailtoUrl(email);
  const telUrl = buildTelUrl(phone);
  const smsUrl = buildSmsUrl(phone);
  const whatsUrl = buildWhatsAppUrl(phone);
  const canOpenPhone = Boolean(telUrl || smsUrl || whatsUrl);

  return (
    <>
      <ContactRow
        accessibilityLabel={canOpenPhone ? phoneLabel : undefined}
        icon="phone"
        iconSize={iconSize}
        label={phoneLabel}
        onPress={canOpenPhone ? () => setPhoneMenuOpen(true) : undefined}
      />
      <ContactRow
        accessibilityLabel={mailtoUrl ? emailLabel : undefined}
        icon="email"
        iconSize={iconSize}
        label={emailLabel}
        onPress={mailtoUrl ? () => openContactUrl(mailtoUrl) : undefined}
      />
      <PhoneContactMenu
        onCall={() => {
          setPhoneMenuOpen(false);
          openContactUrl(telUrl);
        }}
        onClose={() => setPhoneMenuOpen(false)}
        onSms={() => {
          setPhoneMenuOpen(false);
          openContactUrl(smsUrl);
        }}
        onWhatsApp={() => {
          setPhoneMenuOpen(false);
          openContactUrl(whatsUrl);
        }}
        visible={phoneMenuOpen}
      />
    </>
  );
}

type ContactRowProps = {
  label: string;
  icon: 'phone' | 'email';
  iconSize: number;
  accessibilityLabel?: string;
  onPress?: () => void;
};

function ContactRow({
  label,
  icon,
  iconSize,
  accessibilityLabel,
  onPress,
}: ContactRowProps) {
  const iconName =
    icon === 'phone'
      ? { ios: 'phone' as const, android: 'call' as const, web: 'call' as const }
      : { ios: 'envelope' as const, android: 'mail' as const, web: 'mail' as const };

  const content = (
    <>
      <SymbolView
        name={iconName}
        size={iconSize}
        tintColor={BrandColors.neutral.white}
      />
      <Body1 color={BrandColors.neutral.white} style={styles.value}>
        {label}
      </Body1>
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: {
    flexShrink: 1,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.75,
  },
});
