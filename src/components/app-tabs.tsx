import { Tabs } from 'expo-router';

import { AppTabBar, type TabVisual } from '@/components/app-tab-bar';
import { CLIENT_TAB_VISUALS } from '@/components/app-tab-bar';
import { BrandColors } from '@/constants/theme';

type AppTabsProps = {
  visuals?: Record<string, TabVisual>;
  /** Lawyer shell includes Histórico; client does not. */
  showHistorico?: boolean;
};

export default function AppTabs({
  visuals = CLIENT_TAB_VISUALS,
  showHistorico = false,
}: AppTabsProps) {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} visuals={visuals} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: BrandColors.neutral.xdark },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Solicitações' }} />
      {showHistorico ? (
        <Tabs.Screen name="historico" options={{ title: 'Histórico' }} />
      ) : null}
      <Tabs.Screen name="notificacoes" options={{ title: 'Notificações' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
