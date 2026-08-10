import {
  canCancelSolicitationStatus,
  mapCreateSolicitationParamsToWire,
  mapCreateSolicitationWireToResult,
  mapListItemWireToCard,
  mapListagemWireToResult,
  normalizeListagemPayload,
} from './solicitation.mapper';

describe('solicitation.mapper', () => {
  it('maps form values to the create solicitation wire body', () => {
    expect(
      mapCreateSolicitationParamsToWire({
        title: ' Revisão de contrato ',
        practice: 'consultoria',
        specialty: 'civil',
        state: 'sp',
        city: 'São Paulo',
        urgency: 'imediata',
        problem: 'Preciso revisar um contrato.',
        subspecialty: 'CIVIL:CONTRATOS',
        billingMethod: 'valor-fixo',
        minimumExperienceMonths: '24',
      }),
    ).toEqual({
      titulo: 'Revisão de contrato',
      modalidade: 'CONSULTORIA',
      especialidadeCodigo: 'CIVIL',
      subespecialidadeCodigo: 'CONTRATOS',
      uf: 'SP',
      cidade: 'São Paulo',
      urgencia: 'EMERGENCIA',
      descricao: 'Preciso revisar um contrato.',
      formaCobranca: 'VALOR_FIXO',
      experienciaMinimaMeses: 24,
    });
  });

  it('omits optional advanced filters when empty', () => {
    expect(
      mapCreateSolicitationParamsToWire({
        title: 'Demanda',
        practice: 'processo',
        specialty: 'TRABALHISTA',
        state: 'BA',
        city: 'Salvador',
        urgency: 'media',
        problem: 'Descrição do problema',
        subspecialty: '',
        billingMethod: '',
        minimumExperienceMonths: '',
      }),
    ).toEqual({
      titulo: 'Demanda',
      modalidade: 'PROCESSO',
      especialidadeCodigo: 'TRABALHISTA',
      uf: 'BA',
      cidade: 'Salvador',
      urgencia: 'MEDIO',
      descricao: 'Descrição do problema',
    });
  });

  it('maps create response to domain result', () => {
    expect(
      mapCreateSolicitationWireToResult({
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        status: 'AGUARDANDO_MATCHING',
        titulo: 'Demanda',
        modalidade: 'CONSULTORIA',
        especialidadeCodigo: 'CIVIL',
        subespecialidadeCodigo: null,
        uf: 'SP',
        cidade: 'São Paulo',
        urgencia: 'EMERGENCIA',
        descricao: 'Texto',
        formaCobranca: null,
        experienciaMinimaMeses: null,
        totalMatches: 3,
        criadoEm: '2026-08-04T12:00:00',
      }),
    ).toEqual({
      id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      status: 'AGUARDANDO_MATCHING',
      title: 'Demanda',
      totalMatches: 3,
      createdAt: '2026-08-04T12:00:00',
    });
  });

  it('normalizes the new listagem envelope with items and counts', () => {
    const normalized = normalizeListagemPayload({
      items: [
        {
          id: 'sol-1',
          status: 'AGUARDANDO_MATCHING',
          urgencia: 'URGENTE',
          titulo: 'Caso',
          descricao: 'Desc',
          dataAbertura: '2026-08-04T12:00:00',
          especialidadeCodigo: 'CIVIL',
          especialidade: 'Civil',
          totalMatches: 2,
        },
      ],
      contagemPorStatus: {
        AGUARDANDO_MATCHING: 1,
        CANCELADA: 2,
      },
    });

    const result = mapListagemWireToResult(normalized, 1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Caso');
    expect(result.countsByStatus.AGUARDANDO_MATCHING).toBe(1);
    expect(result.countsByStatus.CANCELADA).toBe(2);
  });

  it('normalizes legacy listagem payloads that return a bare array', () => {
    const normalized = normalizeListagemPayload([
      {
        id: 'sol-1',
        status: 'AGUARDANDO_MATCHING',
        urgencia: 'MEDIO',
        titulo: 'Legado',
        descricao: 'Desc',
        dataAbertura: '2026-08-04',
        especialidadeCodigo: 'CIVIL',
        especialidade: 'Civil',
        totalMatches: 0,
      },
    ]);

    const result = mapListagemWireToResult(normalized, 1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].title).toBe('Legado');
    expect(result.countsByStatus.AGUARDANDO_MATCHING).toBe(1);
  });

  it('uses accepted connections count for MATCH_REALIZADO footer', () => {
    const card = mapListItemWireToCard({
      id: 'sol-1',
      status: 'MATCH_REALIZADO',
      urgencia: 'URGENTE',
      titulo: 'Caso',
      descricao: 'Desc',
      dataAbertura: '2026-08-04T12:00:00',
      especialidadeCodigo: 'CIVIL',
      especialidade: 'Civil',
      totalMatches: 5,
      totalConexoesAceitas: 1,
    });

    expect(card.footerVariant).toBe('accepted');
    expect(card.lawyerCount).toBe(1);
  });

  it('uses totalMatches for pending compatible footer', () => {
    const card = mapListItemWireToCard({
      id: 'sol-2',
      status: 'AGUARDANDO_MATCHING',
      urgencia: 'MEDIO',
      titulo: 'Caso',
      descricao: 'Desc',
      dataAbertura: '2026-08-04T12:00:00',
      especialidadeCodigo: 'CIVIL',
      especialidade: 'Civil',
      totalMatches: 5,
      totalConexoesAceitas: 0,
    });

    expect(card.footerVariant).toBe('compatible');
    expect(card.lawyerCount).toBe(5);
  });

  it('allows cancel only while AGUARDANDO_MATCHING', () => {
    expect(canCancelSolicitationStatus('AGUARDANDO_MATCHING')).toBe(true);
    expect(canCancelSolicitationStatus('MATCH_REALIZADO')).toBe(false);
    expect(canCancelSolicitationStatus('CANCELADA')).toBe(false);
    expect(canCancelSolicitationStatus(undefined)).toBe(false);
  });
});
