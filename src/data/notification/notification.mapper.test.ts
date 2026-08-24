import {
  formatNotificationDate,
  mapNaoLidasWireToResult,
  mapNotificacaoWireToResult,
} from './notification.mapper';
import type { NotificacaoWire } from './notification.types';

const sampleWire: NotificacaoWire = {
  id: 'notif-1',
  titulo: 'Nova solicitação de conexão',
  texto: 'Maria solicitou conexão sobre "Revisão de contrato"',
  tipo: 'CONEXAO_SOLICITADA',
  referenciaTipo: 'CONEXAO',
  referenciaId: 'cx-1',
  remetenteId: 'user-cli',
  criadoEm: '2026-08-06T12:00:00',
  lidaEm: null,
  statusEnvio: 'ENVIADA',
};

describe('mapNotificacaoWireToResult', () => {
  it('maps wire fields and marks unread when lidaEm is null', () => {
    const result = mapNotificacaoWireToResult(sampleWire);

    expect(result).toMatchObject({
      id: 'notif-1',
      title: 'Nova solicitação de conexão',
      body: 'Maria solicitou conexão sobre "Revisão de contrato"',
      type: 'CONEXAO_SOLICITADA',
      referenceType: 'CONEXAO',
      referenceId: 'cx-1',
      senderId: 'user-cli',
      createdAt: '2026-08-06T12:00:00',
      readAt: null,
      isUnread: true,
      deliveryStatus: 'ENVIADA',
    });
  });

  it('marks read when lidaEm is present', () => {
    const result = mapNotificacaoWireToResult({
      ...sampleWire,
      tipo: 'CONEXAO_ACEITA',
      lidaEm: '2026-08-06T13:00:00',
      statusEnvio: 'SKIPPED',
    });

    expect(result.type).toBe('CONEXAO_ACEITA');
    expect(result.readAt).toBe('2026-08-06T13:00:00');
    expect(result.isUnread).toBe(false);
    expect(result.deliveryStatus).toBe('SKIPPED');
  });
});

describe('mapNaoLidasWireToResult', () => {
  it('maps existe flag', () => {
    expect(mapNaoLidasWireToResult({ existe: true })).toEqual({ exists: true });
    expect(mapNaoLidasWireToResult({ existe: false })).toEqual({ exists: false });
  });
});

describe('formatNotificationDate', () => {
  it('formats ISO datetime as pt-BR date', () => {
    expect(formatNotificationDate('2026-08-06T12:00:00')).toMatch(/06\/08\/2026/);
  });

  it('returns em dash for blank values', () => {
    expect(formatNotificationDate('')).toBe('—');
  });
});
