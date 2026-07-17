import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body1, Display } from '@/atomic/typography';
import { Separator } from '@/atomic/separator';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function ClientHistoricoScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Display color={BrandColors.neutral.white}>Histórico</Display>
          <Separator size="sm" />
          <Body1 color={BrandColors.neutral.light}>
            Histórico de solicitações do cliente (em breve).
          </Body1>
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
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
});
