import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassBackground } from '@/atomic/glass';
import { InputCaption } from '@/atomic/typography';
import { BrandColors, BrandGradients, Radius, Spacing } from '@/constants/theme';
import { useUnreadNotificationsExist } from '@/domain/notification';

import type { TabVisual } from './tab-visuals';
import { CLIENT_TAB_VISUALS } from './tab-visuals';

/** Icon + label + vertical paddings inside the tab bar (above safe-area inset). */
export const TAB_BAR_CONTENT_HEIGHT = 68;

/** Matches {@link AppTabBar} bottom padding when the device reports no inset. */
export function getTabBarBottomInset(safeAreaBottom: number): number {
  return Math.max(safeAreaBottom, Spacing.xs);
}

export function getTabBarTotalHeight(safeAreaBottom: number): number {
  return TAB_BAR_CONTENT_HEIGHT + getTabBarBottomInset(safeAreaBottom);
}

type TabBarProps = {
  state: {
    index: number;
    routes: Array<{ key: string; name: string; params?: object }>;
  };
  descriptors: Record<
    string,
    {
      options: {
        tabBarAccessibilityLabel?: string;
      };
    }
  >;
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
  visuals?: Record<string, TabVisual>;
};

const NOTIFICATIONS_TAB = 'notificacoes';

export function AppTabBar({
  state,
  descriptors,
  navigation,
  visuals = CLIENT_TAB_VISUALS,
}: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { data: unread } = useUnreadNotificationsExist();
  const hasUnread = Boolean(unread?.exists);

  const items = state.routes.flatMap((route, index) => {
    const visual = visuals[route.name];
    if (!visual) {
      return [];
    }

    const focused = state.index === index;
    const color = focused ? BrandColors.primary.light : BrandColors.neutral.white;
    const { options } = descriptors[route.key];
    const showUnreadDot = route.name === NOTIFICATIONS_TAB && hasUnread;
    const accessibilityLabel =
      options.tabBarAccessibilityLabel ??
      (showUnreadDot ? `${visual.label}, não lidas` : visual.label);

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!focused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return [
      <Pressable
        key={route.key}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
        <View style={styles.iconSlot}>
          {visual.renderIcon(color)}
          {showUnreadDot ? (
            <View
              importantForAccessibility="no"
              style={[
                styles.unreadDot,
                focused ? styles.unreadDotSelected : styles.unreadDotIdle,
              ]}
              testID="tab-notifications-unread-dot"
            />
          ) : null}
        </View>
        <InputCaption color={color}>{visual.label}</InputCaption>
      </Pressable>,
    ];
  });

  return (
    <View style={[styles.bar, { paddingBottom: getTabBarBottomInset(insets.bottom) }]}>
      {Platform.OS === 'android' ? null : (
        <GlassBackground blurPx={25} gradient={BrandGradients.gradient} />
      )}
      {items}
    </View>
  );
}

const glassShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    // Avoid elevation: transparent/elevated views paint a gray plate and
    // can contribute to Fabric mount issues on Android.
    elevation: 0,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

const DOT_SIZE = 8;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // Solid base: Android elevation + transparent bg paints a gray plate.
    backgroundColor: BrandColors.neutral.xdark,
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    // TODO(tab-bar): revisitar borda glass (opacidade / 1px vs hairline) no polish de UI
    borderColor: 'rgba(255, 255, 255, 0.28)',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xxs,
    ...glassShadow,
  },
  item: {
    flex: 1,
    zIndex: 1,
    alignItems: 'center',
    gap: Spacing.xxxs,
    paddingVertical: Spacing.xxxs,
  },
  itemPressed: {
    opacity: 0.75,
  },
  iconSlot: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    zIndex: 1,
  },
  unreadDotSelected: {
    backgroundColor: BrandColors.neutral.white,
  },
  unreadDotIdle: {
    backgroundColor: BrandColors.primary.light,
  },
});

export type AppTabBarProps = TabBarProps;
