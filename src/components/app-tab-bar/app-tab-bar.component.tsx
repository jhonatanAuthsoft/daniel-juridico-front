import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassBackground } from '@/atomic/glass';
import { InputCaption } from '@/atomic/typography';
import { BrandColors, BrandGradients, Radius, Spacing } from '@/constants/theme';

import type { TabVisual } from './tab-visuals';
import { CLIENT_TAB_VISUALS } from './tab-visuals';

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

export function AppTabBar({
  state,
  descriptors,
  navigation,
  visuals = CLIENT_TAB_VISUALS,
}: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, Spacing.xs) }]}>
      <GlassBackground blurPx={25} gradient={BrandGradients.gradient} />
      {state.routes.map((route, index) => {
        const visual = visuals[route.name];
        if (!visual) {
          return null;
        }

        const focused = state.index === index;
        const color = focused ? BrandColors.primary.light : BrandColors.neutral.white;
        const { options } = descriptors[route.key];

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

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? visual.label}
            onPress={onPress}
            style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}>
            <View style={styles.iconSlot}>{visual.renderIcon(color)}</View>
            <InputCaption color={color}>{visual.label}</InputCaption>
          </Pressable>
        );
      })}
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
    elevation: 12,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

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
    backgroundColor: 'transparent',
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
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type AppTabBarProps = TabBarProps;
