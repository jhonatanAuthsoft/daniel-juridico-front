import type { LawyerHistoryItem } from '@/components/lawyer-history';
import type { LawyerSolicitationCardData } from '@/components/lawyer-solicitation-card';
import type { ConnectionResult } from '@/data/connection';

function formatConnectionTimeLabel(iso: string): string {
  const text = iso.trim();
  if (!text) {
    return '—';
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return text;
  }

  return date.toLocaleDateString('pt-BR');
}

/** Maps a pending connection into the lawyer home card shape. */
export function mapConnectionToLawyerCard(
  connection: ConnectionResult,
): LawyerSolicitationCardData {
  return {
    id: connection.id,
    clientName: connection.nomeCliente?.trim() || 'Cliente',
    status: 'medio',
    description:
      connection.tituloSolicitacao?.trim() || 'Pedido de conexão',
    timeLabel: formatConnectionTimeLabel(connection.criadoEm),
    timeKind: 'absolute',
    location: '—',
  };
}

/** Maps accepted/rejected connections into lawyer history items. */
export function mapConnectionToLawyerHistoryItem(
  connection: ConnectionResult,
): LawyerHistoryItem | null {
  if (connection.status !== 'ACEITA' && connection.status !== 'RECUSADA') {
    return null;
  }

  return {
    id: connection.id,
    clientName: connection.nomeCliente?.trim() || 'Cliente',
    urgency: 'medio',
    description:
      connection.tituloSolicitacao?.trim() || 'Pedido de conexão',
    decision: connection.status === 'ACEITA' ? 'accepted' : 'rejected',
  };
}
