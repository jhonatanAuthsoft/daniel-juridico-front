import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Body1 } from '@/atomic/typography';
import { Separator } from '@/atomic/separator';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';

import { MOCK_LAWYER_NOTIFICATIONS } from './mock-lawyer-notifications';
import { NotificationCard } from './notification-card.component';

const TAB_BAR_CONTENT_HEIGHT = 62;
const LIST_GAP_ABOVE_TAB = 16;

export function LawyerNotificationsInbox() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const listPaddingBottom =
    TAB_BAR_CONTENT_HEIGHT + insets.bottom + LIST_GAP_ABOVE_TAB;

  return (
    <View style={styles.root}>
      <View style={[styles.headerBlock, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Voltar"
            accessibilityRole="button"
            hitSlop={Spacing.xxs}
            onPress={() => router.back()}
            style={({ pressed }) => pressed && styles.pressed}>
            <SymbolView
              name={{
                ios: 'chevron.left',
                android: 'chevron_left',
                web: 'chevron_left',
              }}
              size={24}
              tintColor={BrandColors.neutral.white}
            />
          </Pressable>
          <Body1 color={BrandColors.neutral.white} style={styles.headerTitle}>
            Caixa de entrada
          </Body1>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <FlatList
        data={MOCK_LAWYER_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: listPaddingBottom },
        ]}
        ItemSeparatorComponent={() => <Separator size="sm" />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <NotificationCard notification={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  headerBlock: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
});
