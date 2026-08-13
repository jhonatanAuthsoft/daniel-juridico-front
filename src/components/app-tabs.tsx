import { useCallback } from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';

import {
  AppTabBar,
  CLIENT_TAB_VISUALS,
  type AppTabBarProps,
  type TabVisual,
} from '@/components/app-tab-bar';
import { BrandColors } from '@/constants/theme';

type AppTabsProps = {
  visuals?: Record<string, TabVisual>;
  /** Lawyer shell includes Histórico; client does not. */
  showHistorico?: boolean;
};

const tabScreenOptions = {
  headerShown: false,
  freezeOnBlur: false,
  sceneStyle: { backgroundColor: BrandColors.neutral.xdark },
  tabBarStyle: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
};

export default function AppTabs({
  visuals = CLIENT_TAB_VISUALS,
  showHistorico = false,
}: AppTabsProps) {
  const renderTabBar = useCallback(
    (props: AppTabBarProps) => <AppTabBar {...props} visuals={visuals} />,
    [visuals],
  );

  // Separate trees — never pass `null` as a Tabs child (Expo Router warns;
  // Android Fabric can crash with addViewAt / child already has a parent).
  // Also disable detach on Android: screen recycling races mount after login.
  const detachInactiveScreens = Platform.OS !== 'android';

  if (showHistorico) {
    return (
      <Tabs
        detachInactiveScreens={detachInactiveScreens}
        tabBar={renderTabBar}
        screenOptions={tabScreenOptions}>
        <Tabs.Screen name="index" options={{ title: 'Solicitações' }} />
        <Tabs.Screen name="historico" options={{ title: 'Histórico' }} />
        <Tabs.Screen name="notificacoes" options={{ title: 'Notificações' }} />
        <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
      </Tabs>
    );
  }

  return (
    <Tabs
      detachInactiveScreens={detachInactiveScreens}
      tabBar={renderTabBar}
      screenOptions={tabScreenOptions}>
      <Tabs.Screen name="index" options={{ title: 'Solicitações' }} />
      <Tabs.Screen name="notificacoes" options={{ title: 'Notificações' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
