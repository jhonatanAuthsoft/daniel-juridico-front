import type { ReactNode } from 'react';

import { StyleSheet } from 'react-native';

import { BellsIcon } from '@/assets/icon/bells-icon';
import { HistoryIcon } from '@/assets/icon/history-icon';
import { SolicitationIcon } from '@/assets/icon/solicitation-icon';
import { ProfileAvatar } from '@/components/profile-avatar';
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
      <ProfileAvatar style={avatarStyle} testID="tab-profile-image" />
    ),
  };
}

/** Client: Solicitações, Notificações, Perfil (sem Histórico). */
export const CLIENT_TAB_VISUALS: Record<string, TabVisual> = {
  index: {
    label: 'Solicitações',
    renderIcon: (color) => (
      <SolicitationIcon width={22} height={22} color={color} />
    ),
  },
  notificacoes: {
    label: 'Notificações',
    renderIcon: (color) => <BellsIcon width={22} height={22} color={color} />,
  },
  perfil: profileVisual(),
};

/** Lawyer: Solicitações, Histórico, Notificações, Perfil. */
export const LAWYER_TAB_VISUALS: Record<string, TabVisual> = {
  index: {
    label: 'Solicitações',
    renderIcon: (color) => (
      <SolicitationIcon width={22} height={22} color={color} />
    ),
  },
  historico: {
    label: 'Histórico',
    renderIcon: (color) => <HistoryIcon width={22} height={22} color={color} />,
  },
  notificacoes: {
    label: 'Notificações',
    renderIcon: (color) => <BellsIcon width={22} height={22} color={color} />,
  },
  perfil: profileVisual(),
};

export function tabVisualsForRole(role: UserRole): Record<string, TabVisual> {
  return role === 'LAWYER' ? LAWYER_TAB_VISUALS : CLIENT_TAB_VISUALS;
}
