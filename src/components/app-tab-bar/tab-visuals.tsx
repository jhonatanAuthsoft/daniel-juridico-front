import type { ReactNode } from 'react';

import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { BellIcon } from '@/assets/icon/bell';
import { HistoryIcon } from '@/assets/icon/history';
import { PaperPlaneIcon } from '@/assets/icon/paper-plane';
import type { UserRole } from '@/domain/auth';

export type TabVisual = {
  label: string;
  renderIcon: (color: string) => ReactNode;
};

const avatarStyle = StyleSheet.create({
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
}).avatar;

function profileVisual(): TabVisual {
  return {
    label: 'Perfil',
    renderIcon: () => (
      <Image
        source={require('@/assets/images/profile.png')}
        style={avatarStyle}
        contentFit="cover"
      />
    ),
  };
}

/** Client: Solicitações, Notificações, Perfil (sem Histórico). */
export const CLIENT_TAB_VISUALS: Record<string, TabVisual> = {
  index: {
    label: 'Solicitações',
    renderIcon: (color) => <PaperPlaneIcon width={22} height={22} color={color} />,
  },
  notificacoes: {
    label: 'Notificações',
    renderIcon: (color) => <BellIcon width={22} height={22} color={color} />,
  },
  perfil: profileVisual(),
};

/** Lawyer: Solicitações, Histórico, Notificações, Perfil. */
export const LAWYER_TAB_VISUALS: Record<string, TabVisual> = {
  index: {
    label: 'Solicitações',
    renderIcon: (color) => <PaperPlaneIcon width={22} height={22} color={color} />,
  },
  historico: {
    label: 'Histórico',
    renderIcon: (color) => <HistoryIcon width={22} height={22} color={color} />,
  },
  notificacoes: {
    label: 'Notificações',
    renderIcon: (color) => <BellIcon width={22} height={22} color={color} />,
  },
  perfil: profileVisual(),
};

export function tabVisualsForRole(role: UserRole): Record<string, TabVisual> {
  return role === 'LAWYER' ? LAWYER_TAB_VISUALS : CLIENT_TAB_VISUALS;
}
