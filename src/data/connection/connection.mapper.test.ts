import {
  mapConexaoStatusToUi,
  mapConexaoWireToResult,
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
});
