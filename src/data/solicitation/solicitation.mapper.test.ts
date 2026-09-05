import {
  canCancelSolicitationStatus,
  mapCreateSolicitationParamsToWire,
  mapCreateSolicitationWireToResult,
  mapListItemWireToCard,
  mapListagemWireToResult,
  mapMatchResultToCompatibleLawyer,
  mapMatchWireToResult,
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
    expect(card.specialty).toBe('Civil');
    expect(card.description).toBe('Desc');
  });

  it('allows cancel only while AGUARDANDO_MATCHING', () => {
    expect(canCancelSolicitationStatus('AGUARDANDO_MATCHING')).toBe(true);
    expect(canCancelSolicitationStatus('MATCH_REALIZADO')).toBe(false);
    expect(canCancelSolicitationStatus('CANCELADA')).toBe(false);
    expect(canCancelSolicitationStatus(undefined)).toBe(false);
  });

  it('keeps the lawyer photo key on compatible lawyer cards', () => {
    const lawyer = mapMatchResultToCompatibleLawyer(
      {
        lawyerId: 'adv-1',
        name: 'Marina Yumi Nakamura',
        photoUrl: 'tmp/advogados/perfil/marina.jpg',
        position: 1,
        compatibility: 90,
        localityLevel: 'MESMA_CIDADE',
        isAvailable: true,
        averageRating: 0,
        totalReviews: 0,
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        practice: { code: 'PAUTISTA', name: 'Pautista' },
      },
      0,
    );

    expect(lawyer.photoUrl).toBe('tmp/advogados/perfil/marina.jpg');
    expect(lawyer.isAvailable).toBe(true);
    expect(lawyer.location).toBe('Bela Vista - São Paulo');
    expect(lawyer.role).toBe('Pautista');
  });

  it('maps match availability from the wire payload', () => {
    expect(
      mapMatchWireToResult({
        advogadoId: 'adv-1',
        nome: 'Marina',
        fotoUrl: null,
        posicao: 1,
        compatibilidade: 90,
        nivelLocalidade: 'MESMA_CIDADE',
        disponibilidade: 'DISPONIVEL',
        mediaAvaliacoes: 5,
        totalAvaliacoes: 1,
        pontuacao: {
          modalidade: 20,
          localidade: 20,
          especialidade: 20,
          subespecialidade: 20,
          experiencia: 10,
          formaCobranca: 10,
        },
      }).isAvailable,
    ).toBe(true);

    expect(
      mapMatchWireToResult({
        advogadoId: 'adv-2',
        nome: 'Igor',
        fotoUrl: null,
        posicao: 2,
        compatibilidade: 80,
        nivelLocalidade: 'MESMO_ESTADO',
        disponibilidade: 'INDISPONIVEL',
        mediaAvaliacoes: null,
        totalAvaliacoes: null,
        pontuacao: {
          modalidade: 20,
          localidade: 10,
          especialidade: 20,
          subespecialidade: 20,
          experiencia: 10,
          formaCobranca: 10,
        },
      }).isAvailable,
    ).toBe(false);

    expect(
      mapMatchWireToResult({
        advogadoId: 'adv-3',
        nome: 'Helena',
        fotoUrl: null,
        posicao: 3,
        compatibilidade: 70,
        nivelLocalidade: 'MESMA_CIDADE',
        mediaAvaliacoes: null,
        totalAvaliacoes: null,
        pontuacao: {
          modalidade: 20,
          localidade: 20,
          especialidade: 20,
          subespecialidade: 0,
          experiencia: 10,
          formaCobranca: 0,
        },
      }).isAvailable,
    ).toBe(true);
  });

  it('maps neighborhood, city and practice modality from the match wire', () => {
    const match = mapMatchWireToResult({
      advogadoId: 'adv-1',
      nome: 'Maria Gomes',
      fotoUrl: null,
      posicao: 1,
      compatibilidade: 50,
      nivelLocalidade: 'MESMA_CIDADE',
      disponibilidade: 'DISPONIVEL',
      mediaAvaliacoes: 5,
      totalAvaliacoes: 1,
      bairro: 'Rio Branco',
      cidade: 'Salvador',
      modalidadeAtuacao: { codigo: 'PAUTISTA', nome: 'Pautista' },
      pontuacao: {
        modalidade: 20,
        localidade: 20,
        especialidade: 20,
        subespecialidade: 20,
        experiencia: 10,
        formaCobranca: 10,
      },
    });

    expect(match.neighborhood).toBe('Rio Branco');
    expect(match.city).toBe('Salvador');
    expect(match.practice).toEqual({ code: 'PAUTISTA', name: 'Pautista' });
  });
});
