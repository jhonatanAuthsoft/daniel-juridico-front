import {
  isEmergencyConnection,
  mapConnectionToLawyerCard,
  mapConnectionToLawyerHistoryItem,
  mapConnectionToLawyerSolicitationDetails,
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
  visualizadaEm: null,
  telefone: null,
  email: null,
  nomeAdvogado: 'Bruna',
  nomeCliente: 'Ana Cliente',
  tituloSolicitacao: 'Revisão de contrato',
  descricaoSolicitacao: 'Preciso revisar um contrato.',
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
  clienteTelefone: null,
  clienteEmail: null,
  avaliacaoClienteNota: null,
  avaliacaoClienteComentario: null,
};

describe('connection-ui.mapper', () => {
  it('maps pending connection to lawyer card', () => {
    const card = mapConnectionToLawyerCard(sample);
    expect(card).toMatchObject({
      id: 'cx-1',
      clientName: 'Ana Cliente',
      description: 'Preciso revisar um contrato.',
      status: 'emergencia',
      timeKind: 'absolute',
      specialty: 'Civil',
    });
  });

  it('flags the lawyer card as never opened while there is no visualizadaEm', () => {
    expect(mapConnectionToLawyerCard(sample).isUnviewed).toBe(true);
    expect(
      mapConnectionToLawyerCard({
        ...sample,
        visualizadaEm: '2026-08-07T09:00:00.000Z',
      }).isUnviewed,
    ).toBe(false);
  });

  it('prefers the catalog specialty label on the lawyer card', () => {
    const card = mapConnectionToLawyerCard(sample, {
      specialtyLabel: 'Direito do Consumidor',
    });
    expect(card.specialty).toBe('Direito do Consumidor');
  });

  it('falls back to the title when the solicitation has no description', () => {
    const card = mapConnectionToLawyerCard({
      ...sample,
      descricaoSolicitacao: null,
    });
    expect(card.description).toBe('Revisão de contrato');
  });

  it('maps accepted/rejected to history items', () => {
    expect(
      mapConnectionToLawyerHistoryItem({ ...sample, status: 'ACEITA' }),
    ).toMatchObject({
      id: 'cx-1',
      decision: 'accepted',
      urgency: 'emergencia',
      specialty: 'Civil',
      dateLabel: new Date(sample.criadoEm).toLocaleDateString('pt-BR'),
    });
    expect(
      mapConnectionToLawyerHistoryItem({ ...sample, status: 'RECUSADA' }),
    ).toMatchObject({
      decision: 'rejected',
    });
    expect(mapConnectionToLawyerHistoryItem(sample)).toBeNull();
  });

  it('prefers the catalog specialty label on history items', () => {
    expect(
      mapConnectionToLawyerHistoryItem(
        { ...sample, status: 'ACEITA' },
        { specialtyLabel: 'Direito do Consumidor' },
      )?.specialty,
    ).toBe('Direito do Consumidor');
  });

  it('maps connection to solicitation details and detects emergency', () => {
    const details = mapConnectionToLawyerSolicitationDetails(sample);
    expect(details.title).toBe('Revisão de contrato');
    expect(details.status).toBe('emergencia');
    expect(details.specialties).toEqual(['Civil']);
    expect(details.subspecialties).toEqual(['Contratos']);
    expect(details.minimumExperienceMonths).toBe(6);
    expect(details.client.pronouns).toBe('Ela/Dela');
    expect(details.clientReview).toBeNull();
    expect(isEmergencyConnection(sample)).toBe(true);
    expect(
      isEmergencyConnection({ ...sample, urgencia: 'MEDIO' }),
    ).toBe(false);
  });

  it('maps client review when present on the connection', () => {
    const details = mapConnectionToLawyerSolicitationDetails({
      ...sample,
      avaliacaoClienteNota: 4,
      avaliacaoClienteComentario:
        'Profissional excepcional, muito feliz em ser atendida por ela',
    });

    expect(details.clientReview).toEqual({
      rating: 4,
      comment:
        'Profissional excepcional, muito feliz em ser atendida por ela',
    });
  });

  it('maps a client review with stars only when the comment is empty', () => {
    const details = mapConnectionToLawyerSolicitationDetails({
      ...sample,
      avaliacaoClienteNota: 2.5,
      avaliacaoClienteComentario: null,
    });

    expect(details.clientReview).toEqual({
      rating: 2.5,
      comment: '',
    });
  });
});
