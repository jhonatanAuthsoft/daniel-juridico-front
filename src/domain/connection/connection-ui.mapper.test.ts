import {
  mapConnectionToLawyerCard,
  mapConnectionToLawyerHistoryItem,
} from './connection-ui.mapper';
import type { ConnectionResult } from '@/data/connection';

const sample: ConnectionResult = {
  id: 'cx-1',
  solicitacaoId: 'sol-1',
  clienteId: 'cli-1',
  advogadoId: 'adv-1',
  status: 'PENDENTE',
  uiStatus: 'pending',
  criadoEm: '2026-08-06T12:00:00.000Z',
  decididoEm: null,
  canceladoEm: null,
  telefone: null,
  email: null,
  nomeAdvogado: 'Bruna',
  nomeCliente: 'Ana Cliente',
  tituloSolicitacao: 'Revisão de contrato',
};

describe('connection-ui.mapper', () => {
  it('maps pending connection to lawyer card', () => {
    const card = mapConnectionToLawyerCard(sample);
    expect(card).toMatchObject({
      id: 'cx-1',
      clientName: 'Ana Cliente',
      description: 'Revisão de contrato',
      timeKind: 'absolute',
    });
  });

  it('maps accepted/rejected to history items', () => {
    expect(
      mapConnectionToLawyerHistoryItem({ ...sample, status: 'ACEITA' }),
    ).toMatchObject({
      id: 'cx-1',
      decision: 'accepted',
    });
    expect(
      mapConnectionToLawyerHistoryItem({ ...sample, status: 'RECUSADA' }),
    ).toMatchObject({
      decision: 'rejected',
    });
    expect(mapConnectionToLawyerHistoryItem(sample)).toBeNull();
  });
});
