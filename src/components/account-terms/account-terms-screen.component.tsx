import { StyleSheet, View } from 'react-native';

import { Body1, Display } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { BrandColors, Spacing } from '@/constants/theme';
import { useLogScreenAccess } from '@/domain/auth';

import { TERMS_SECTIONS } from './legal-terms.data';

export function AccountTermsScreen() {
  useLogScreenAccess('TERMS');

  return (
    <AccountStackScreen title="Termos e condições">
      <Display color={BrandColors.neutral.white}>
        Termos de uso e Política de Privacidade
      </Display>
      <View style={styles.paragraphs}>
        {TERMS_SECTIONS.map((section) => (
          <View key={section.id} style={styles.section}>
            <Body1 bold color={BrandColors.neutral.white}>
              {section.title}
            </Body1>
            <Body1 color={BrandColors.neutral.white}>{section.text}</Body1>
          </View>
        ))}
      </View>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  paragraphs: {
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.xs,
  },
});
