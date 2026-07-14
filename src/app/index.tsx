import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Body1,
  Body2,
  Display,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  InputCaption,
  InputLabel,
  InputValue,
  Link,
  LinkSmall,
} from '@/atomic/typography';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StyleGuideRowProps = {
  label: string;
  children: ReactNode;
};

function StyleGuideRow({ label, children }: StyleGuideRowProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <Body2 color={theme.textSecondary}>{label}</Body2>
      {children}
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Display>Style Guide</Display>
          <Body1 color={theme.textSecondary}>Typography</Body1>

          <StyleGuideRow label="Display · 700 · Large · 130%">
            <Display>Display</Display>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 1 · 600 · Medium · 130%">
            <Heading1>Heading 1</Heading1>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 2 · 700 · Small · 130%">
            <Heading2>Heading 2</Heading2>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 3 · 500 · X-Small · 130%">
            <Heading3>Heading 3</Heading3>
          </StyleGuideRow>

          <StyleGuideRow label="Heading 4 · 700 · XX-Small · 130%">
            <Heading4>Heading 4</Heading4>
          </StyleGuideRow>

          <StyleGuideRow label="Body 1 · 500 · Small · 150%">
            <Body1>Body 1</Body1>
          </StyleGuideRow>

          <StyleGuideRow label="Body 1 Bold · 700 · Small · 150%">
            <Body1 bold>Body 1 Bold</Body1>
          </StyleGuideRow>

          <StyleGuideRow label="Body 2 · 500 · X-Small · 150%">
            <Body2>Body 2</Body2>
          </StyleGuideRow>

          <StyleGuideRow label="Body 2 Bold · 700 · X-Small · 150%">
            <Body2 bold>Body 2 Bold</Body2>
          </StyleGuideRow>

          <StyleGuideRow label="Link · 500 · X-Small · 150%">
            <Link>Link</Link>
          </StyleGuideRow>

          <StyleGuideRow label="Link Small · 500 · XX-Small · 150%">
            <LinkSmall>Link Small</LinkSmall>
          </StyleGuideRow>

          <StyleGuideRow label="Input Label · 500 · X-Small · 130%">
            <InputLabel>Input Label</InputLabel>
          </StyleGuideRow>

          <StyleGuideRow label="Input Value · 500 · X-Small · 130%">
            <InputValue>Input Value</InputValue>
          </StyleGuideRow>

          <StyleGuideRow label="Input Caption · 500 · XXX-Small · 130%">
            <InputCaption>Input Caption</InputCaption>
          </StyleGuideRow>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  row: {
    gap: Spacing.one,
  },
});
