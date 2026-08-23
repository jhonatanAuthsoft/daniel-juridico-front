import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { LoadingState } from '@/atomic/loading-state';
import { Separator } from '@/atomic/separator';
import { Body1, Body2, Link } from '@/atomic/typography';
import { useSplashGate } from '@/components/splash-guard';
import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import type { NotificationResult } from '@/data/notification';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/domain/notification';

import { NotificationCard } from './notification-card.component';
import { NotificationsListShimmer } from './notification-card-shimmer.component';

const TAB_BAR_CONTENT_HEIGHT = 62;
const LIST_GAP_ABOVE_TAB = 16;

export function NotificationsInbox() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const splashGate = useSplashGate();
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetched,
  } = useNotifications();

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const listPaddingBottom =
    TAB_BAR_CONTENT_HEIGHT + insets.bottom + LIST_GAP_ABOVE_TAB;

  const hasUnread = notifications.some((item) => item.isUnread);
  const hasData = notifications.length > 0;

  useEffect(() => {
    if (isFetched || isError) {
      splashGate?.markContentReady();
    }
  }, [isFetched, isError, splashGate]);

  const handlePullRefresh = async () => {
    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const handlePress = (notification: NotificationResult) => {
    if (notification.isUnread) {
      markRead.mutate(notification.id);
    }
  };

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
            <CaretLeftIcon
              color={BrandColors.neutral.white}
              height={24}
              width={24}
            />
          </Pressable>
          <Body1 color={BrandColors.neutral.white} style={styles.headerTitle}>
            Caixa de entrada
          </Body1>
          <View style={styles.headerSpacer} />
        </View>

        {hasUnread ? (
          <Pressable
            accessibilityLabel="Marcar todas como lidas"
            accessibilityRole="button"
            disabled={markAllRead.isPending}
            onPress={() => markAllRead.mutate()}
            style={({ pressed }) => [
              styles.markAllRow,
              pressed && styles.pressed,
            ]}>
            <Link color={BrandColors.primary.light}>Marcar todas como lidas</Link>
          </Pressable>
        ) : null}
      </View>

      <LoadingState
        data={hasData}
        error={isError}
        loading={isLoading && !isPullRefreshing}
        style={styles.loadingState}>
        <LoadingState.Shimmer>
          <View style={[styles.listContent, { paddingBottom: listPaddingBottom }]}>
            <NotificationsListShimmer />
          </View>
        </LoadingState.Shimmer>

        <LoadingState.ErrorPlaceholder>
          <View style={[styles.listContent, { paddingBottom: listPaddingBottom }]}>
            <Body2 color={BrandColors.neutral.light}>
              {getErrorMessage(error, 'Não foi possível carregar as notificações.')}
            </Body2>
            <Separator size="sm" />
            <Pressable
              accessibilityLabel="Tentar novamente"
              accessibilityRole="button"
              onPress={() => {
                void refetch();
              }}>
              <Link color={BrandColors.primary.light}>Tentar novamente</Link>
            </Pressable>
          </View>
        </LoadingState.ErrorPlaceholder>

        <LoadingState.EmptyState>
          <View
            style={[
              styles.emptyWrap,
              { paddingBottom: listPaddingBottom },
            ]}>
            <Body1 color={BrandColors.neutral.white} style={styles.emptyTitle}>
              Nenhuma notificação
            </Body1>
            <Separator size="xxs" />
            <Body2 color={BrandColors.neutral.light} style={styles.emptyDescription}>
              Quando houver novas notificações, elas aparecerão aqui.
            </Body2>
          </View>
        </LoadingState.EmptyState>

        <FlatList
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: listPaddingBottom },
          ]}
          data={notifications}
          ItemSeparatorComponent={() => <Separator size="sm" />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                void handlePullRefresh();
              }}
              refreshing={isPullRefreshing}
              tintColor={BrandColors.primary.light}
            />
          }
          renderItem={({ item }) => (
            <NotificationCard notification={item} onPress={handlePress} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </LoadingState>
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
    gap: Spacing.xs,
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
  markAllRow: {
    alignSelf: 'flex-end',
  },
  loadingState: {
    flex: 1,
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
  },
  emptyWrap: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    maxWidth: 320,
  },
  pressed: {
    opacity: 0.75,
  },
});
