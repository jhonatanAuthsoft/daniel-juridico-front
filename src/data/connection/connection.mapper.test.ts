import {
  emptyConnectionStatusCounts,
  emptyConnectionUrgencyCounts,
  mapContagemPorStatus,
  mapContagemPorUrgencia,
  mapConexaoStatusToUi,
  mapConexaoWireToResult,
  normalizeConexaoListagemPayload,
} from './connection.mapper';
import type { ConexaoWire } from './connection.types';

const sampleWire: ConexaoWire = {
  id: 'cx-1',
  solicitacaoId: 'sol-1',
  clienteId: 'cli-1',
  advogadoId: 'adv-1',
  status: 'ACEITA',
  criadoEm: '2026-08-06T12:00:00',
  decididoEm: '2026-08-06T13:00:00',
  canceladoEm: null,
  visualizadaEm: null,
  telefone: '11988887777',
  email: 'adv@laweact.com',
  nomeAdvogado: 'Bruna Capital',
  nomeCliente: 'Ana Cliente',
  tituloSolicitacao: 'Revisão de contrato',
  descricaoSolicitacao: 'Detalhe da demanda',
  urgencia: 'EMERGENCIA',
  modalidade: 'CONSULTORIA',
  especialidadeCodigo: 'CIVIL',
  subespecialidadeCodigo: 'CONTRATOS',
  experienciaMinimaMeses: 6,
  uf: 'SP',
  cidade: 'São Paulo',
  formaCobranca: 'VALOR_FIXO',
  clienteProfissao: 'Analista',
  clientePronomes: 'ELA',
  clienteEstadoCivil: 'Solteiro(a)',
  clienteFaixaRenda: 'R$ 5.000,00',
  clienteFotoUrl: null,
  clienteCidade: 'São Paulo',
  clienteUf: 'SP',
  clienteTelefone: '11977776666',
  clienteEmail: 'ana@laweact.com',
  avaliacaoClienteNota: 4,
  avaliacaoClienteComentario: 'Ótimo atendimento',
};

describe('mapConexaoStatusToUi', () => {
  it('maps API statuses to UI card states', () => {
    expect(mapConexaoStatusToUi('PENDENTE')).toBe('pending');
    expect(mapConexaoStatusToUi('ACEITA')).toBe('accepted');
    expect(mapConexaoStatusToUi('RECUSADA')).toBe('rejected');
    expect(mapConexaoStatusToUi('CANCELADA')).toBe('idle');
    expect(mapConexaoStatusToUi(null)).toBe('idle');
  });
});

describe('mapConexaoWireToResult', () => {
  it('maps wire fields and exposes contact when ACEITA', () => {
    const result = mapConexaoWireToResult(sampleWire);

    expect(result).toMatchObject({
      id: 'cx-1',
      solicitacaoId: 'sol-1',
      advogadoId: 'adv-1',
      status: 'ACEITA',
      uiStatus: 'accepted',
      telefone: '11988887777',
      email: 'adv@laweact.com',
      nomeAdvogado: 'Bruna Capital',
    });
  });

  it('maps CANCELADA to idle UI without inventing contact', () => {
    const result = mapConexaoWireToResult({
      ...sampleWire,
      status: 'CANCELADA',
      telefone: null,
      email: null,
      decididoEm: null,
      canceladoEm: '2026-08-06T14:00:00',
    });

    expect(result.uiStatus).toBe('idle');
    expect(result.telefone).toBeNull();
    expect(result.email).toBeNull();
    expect(result.canceladoEm).toBe('2026-08-06T14:00:00');
  });

  it('carries visualizadaEm so the lawyer card knows it was already opened', () => {
    expect(mapConexaoWireToResult(sampleWire).visualizadaEm).toBeNull();
    expect(
      mapConexaoWireToResult({
        ...sampleWire,
        visualizadaEm: '2026-08-07T09:00:00',
      }).visualizadaEm,
    ).toBe('2026-08-07T09:00:00');
  });
});

describe('mapContagemPorUrgencia', () => {
  it('fills missing urgency keys with zero', () => {
    expect(mapContagemPorUrgencia({ EMERGENCIA: 8, URGENTE: 6 })).toEqual({
      EMERGENCIA: 8,
      URGENTE: 6,
      MEDIO: 0,
      TENHO_TEMPO: 0,
    });
  });

  it('returns all zeros for a missing payload', () => {
    expect(mapContagemPorUrgencia(null)).toEqual(emptyConnectionUrgencyCounts());
    expect(mapContagemPorUrgencia(undefined)).toEqual(
      emptyConnectionUrgencyCounts(),
    );
  });
});

describe('mapContagemPorStatus', () => {
  it('fills missing status keys with zero', () => {
    expect(mapContagemPorStatus({ ACEITA: 8, RECUSADA: 6 })).toEqual({
      PENDENTE: 0,
      ACEITA: 8,
      RECUSADA: 6,
      CANCELADA: 0,
    });
  });

  it('returns all zeros for a missing payload', () => {
    expect(mapContagemPorStatus(null)).toEqual(emptyConnectionStatusCounts());
    expect(mapContagemPorStatus(undefined)).toEqual(emptyConnectionStatusCounts());
  });
});

describe('normalizeConexaoListagemPayload', () => {
  it('keeps items and counts from the paginated payload', () => {
    const listagem = normalizeConexaoListagemPayload({
      items: [sampleWire],
      contagemPorUrgencia: { EMERGENCIA: 3 },
      contagemPorStatus: { ACEITA: 8, RECUSADA: 6 },
    });

    expect(listagem.items).toHaveLength(1);
    expect(listagem.contagemPorUrgencia).toEqual({ EMERGENCIA: 3 });
    expect(listagem.contagemPorStatus).toEqual({ ACEITA: 8, RECUSADA: 6 });
  });

  it('derives counts locally when the API returns a bare array', () => {
    const listagem = normalizeConexaoListagemPayload([
      sampleWire,
      { ...sampleWire, id: 'cx-2', urgencia: 'MEDIO' },
      { ...sampleWire, id: 'cx-3', urgencia: 'medio' },
      { ...sampleWire, id: 'cx-4', urgencia: null },
    ]);

    expect(listagem.items).toHaveLength(4);
    expect(listagem.contagemPorUrgencia).toEqual({
      EMERGENCIA: 1,
      URGENTE: 0,
      MEDIO: 2,
      TENHO_TEMPO: 0,
    });
    expect(listagem.contagemPorStatus).toEqual({
      PENDENTE: 0,
      ACEITA: 4,
      RECUSADA: 0,
      CANCELADA: 0,
    });
  });

  it('falls back to an empty listing for an unexpected payload', () => {
    expect(normalizeConexaoListagemPayload(null)).toEqual({
      items: [],
      contagemPorUrgencia: {},
      contagemPorStatus: {},
    });
  });
});
