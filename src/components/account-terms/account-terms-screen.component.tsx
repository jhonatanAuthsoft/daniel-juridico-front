import { StyleSheet, View } from 'react-native';

import { Body1, Display } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { BrandColors, Spacing } from '@/constants/theme';

const LOREM =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';

const TERMS_PARAGRAPHS = [
  { id: 'terms-1', text: LOREM },
  { id: 'terms-2', text: `${LOREM} ${LOREM}` },
] as const;

export function AccountTermsScreen() {
  return (
    <AccountStackScreen title="Termos e condições">
      <Display color={BrandColors.neutral.white}>
        Termos de uso e Política de Privacidade
      </Display>
      <View style={styles.paragraphs}>
        {TERMS_PARAGRAPHS.map((paragraph) => (
          <Body1 key={paragraph.id} color={BrandColors.neutral.white}>
            {paragraph.text}
          </Body1>
        ))}
      </View>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  paragraphs: {
    gap: Spacing.lg,
  },
});
