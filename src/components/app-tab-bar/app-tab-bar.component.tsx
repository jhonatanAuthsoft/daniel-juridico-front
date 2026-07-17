import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InputCaption } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

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

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: BrandColors.neutral.black,
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.xxs,
  },
  item: {
    flex: 1,
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
