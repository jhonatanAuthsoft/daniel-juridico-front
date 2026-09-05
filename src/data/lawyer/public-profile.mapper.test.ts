import { mapPublicLawyerProfileWireToResult } from './public-profile.mapper';
import type { PublicLawyerProfileWire } from './public-profile.types';

const sampleWire: PublicLawyerProfileWire = {
  id: 'adv-user-1',
  nome: 'Maria Gomes',
  nomeCompleto: 'Maria Gomes Silva',
  nomeSocial: null,
  pronomeTratamento: 'DOUTORA',
  fotoUrl: 'tmp/advogados/perfil/abc.jpg',
  biografia: 'Especialista em direito civil.',
  disponibilidade: 'DISPONIVEL',
  mediaAvaliacoes: 4.5,
  totalAvaliacoes: 12,
  universidade: 'USP',
  curso: 'Direito',
  anoFormacao: 2015,
  atuacaoDesde: '2016-01-10',
  anosExperiencia: 8,
  endereco: {
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
  },
  oabPrincipal: { numero: '155242', uf: 'SP', principal: true },
  oabsSuplementares: [{ numero: '99887', uf: 'RJ', principal: false }],
  modalidades: [{ codigo: 'PAUTISTA', nome: 'Pautista' }],
  especialidades: [{ codigo: 'CIVIL', nome: 'Direito Civil' }],
  subespecialidades: [{ codigo: 'CONTRATOS', nome: 'Contratos' }],
  formasCobranca: [
    { codigo: 'HONORARIOS_CONTRATUAIS', nome: 'Honorários Contratuais' },
  ],
  areasAtuacao: [{ id: 'a1', estado: 'SP', cidade: 'São Paulo' }],
  posGraduacoes: [],
};

describe('mapPublicLawyerProfileWireToResult', () => {
  it('maps public profile fields for the client UI', () => {
    const profile = mapPublicLawyerProfileWireToResult(sampleWire);

    expect(profile).toMatchObject({
      id: 'adv-user-1',
      name: 'Maria Gomes',
      honorific: 'Doutora/Dra.',
      photoKey: 'tmp/advogados/perfil/abc.jpg',
      biography: 'Especialista em direito civil.',
      yearsOfExperience: 8,
      addressLabel: 'Bela Vista, São Paulo - SP',
      totalReviews: 12,
    });
    expect(profile.primaryOab).toEqual({
      number: '155242',
      uf: 'SP',
      isPrimary: true,
    });
    expect(profile.supplementalOabs).toHaveLength(1);
    expect(profile.specialties[0]?.name).toBe('Direito Civil');
    expect(profile.modalities[0]?.name).toBe('Pautista');
    expect(profile.isAvailable).toBe(true);
  });

  it('marks the profile as unavailable when disponibilidade is INDISPONIVEL', () => {
    const profile = mapPublicLawyerProfileWireToResult({
      ...sampleWire,
      disponibilidade: 'INDISPONIVEL',
    });
    expect(profile.isAvailable).toBe(false);
  });

  it('prefers social name already resolved as nome by the API', () => {
    const profile = mapPublicLawyerProfileWireToResult({
      ...sampleWire,
      nome: 'Nome Social',
      nomeSocial: 'Nome Social',
    });
    expect(profile.name).toBe('Nome Social');
  });
});
