import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { BrandColors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/domain/auth';

type AppTabsProps = {
  visuals?: unknown;
  showHistorico?: boolean;
};

export default function AppTabs({ showHistorico = false }: AppTabsProps = {}) {
  const { user } = useAuth();
  const base = user?.role === 'LAWYER' ? '/lawyer' : '/client';
  const includeHistorico = showHistorico || user?.role === 'LAWYER';

  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="solicitacoes" href={base} asChild>
            <TabButton>Solicitações</TabButton>
          </TabTrigger>
          {includeHistorico ? (
            <TabTrigger name="historico" href={`${base}/historico`} asChild>
              <TabButton>Histórico</TabButton>
            </TabTrigger>
          ) : null}
          <TabTrigger name="notificacoes" href={`${base}/notificacoes`} asChild>
            <TabButton>Notificações</TabButton>
          </TabTrigger>
          <TabTrigger name="perfil" href={`${base}/perfil`} asChild>
            <TabButton>Perfil</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView
        type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
        style={styles.tabButtonView}>
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {children}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.xxs,
    maxWidth: MaxContentWidth,
    backgroundColor: BrandColors.neutral.black,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.xxxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Spacing.sm,
  },
});
