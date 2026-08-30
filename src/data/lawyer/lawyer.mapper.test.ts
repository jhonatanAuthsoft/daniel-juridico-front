import {
  mapBillingMethodToApi,
  mapLawyerSignupFormToRegisterRequest,
  mapPracticeAreaToModalidade,
  mapSpecialtiesToApi,
  mapTreatmentPronounToApi,
  mapUpdateLawyerAddressToWire,
  mapUpdateLawyerBiographyToWire,
  mapUpdateLawyerBillingToWire,
  mapUpdateLawyerDocumentationToWire,
  mapUpdateLawyerGeneralDataToWire,
  mapUpdateLawyerAvailabilityToWire,
  mapUpdateLawyerGraduationToWire,
} from './lawyer.mapper';
import type { LawyerSignupFormValues } from '@/components/signup-lawyer/types';

const baseForm: LawyerSignupFormValues = {
  fullName: 'João Advogado',
  email: 'joao@laweact.com',
  phone: '(11) 98888-7777',
  password: 'Secret12',
  motherName: 'Ana Advogada',
  fatherName: 'José Advogado',
  noFatherName: false,
  rg: '7654321',
  issuingAuthority: 'SSP',
  uf: 'sp',
  cpf: '390.533.447-05',
  cep: '01310-100',
  state: 'SP',
  city: 'sao-paulo',
  neighborhood: 'Bela Vista',
  street: 'Av. Paulista',
  number: '1500',
  complement: 'Conjunto 41',
  oabNumber: '123456',
  oabUf: 'sp',
  oabIssueDate: '15/03/2016',
  oabPhotoUris: ['file://front.jpg', 'file://back.jpg'],
  oabPhotoKeys: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
  supplementalOabs: [
    {
      number: '654321',
      uf: 'rj',
      issueDate: '10/01/2018',
      photoUris: [],
      photoKeys: ['tmp/advogados/oab/front2.jpg', 'tmp/advogados/oab/back2.jpg'],
    },
  ],
  university: 'USP',
  course: 'Direito',
  graduationYear: '2015',
  postgraduates: [{ university: 'FGV', course: 'LLM Direito Digital', year: '2020' }],
  practiceAreas: ['generalista'],
  specialties: ['CIVIL:CONTRATOS', 'IMOBILIARIO:DESPEJO'],
  serviceAreas: [
    { state: 'SP', cities: ['Adamantina', 'Avaré'] },
    { state: 'RJ', cities: ['Niterói'] },
  ],
  serviceDraftState: '',
  serviceDraftCities: [],
  billingMethods: ['contractual', 'to_be_agreed'],
  pronouns: 'DOUTOR',
  profileImageUri: 'file://profile.jpg',
  profileImageKey: 'tmp/advogados/perfil/profile.jpg',
  biography: 'Atuo há 10 anos.',
};

describe('lawyer.mapper', () => {
  it('maps the form to the register payload', () => {
    const payload = mapLawyerSignupFormToRegisterRequest(baseForm);

    expect(payload).toMatchObject({
      nomeCompleto: 'João Advogado',
      email: 'joao@laweact.com',
      senha: 'Secret12',
      rg: '7654321',
      rgOrgaoEmissor: 'SSP',
      rgUf: 'SP',
      cpf: '39053344705',
      nomePai: 'José Advogado',
      nomeMae: 'Ana Advogada',
      pronomeTratamento: 'DOUTOR',
      telefone: '11988887777',
      universidade: 'USP',
      curso: 'Direito',
      anoFormacao: 2015,
      atuacaoDesde: '2016-03-15',
      cidade: 'São Paulo',
      estado: 'SP',
      fotoUrl: 'tmp/advogados/perfil/profile.jpg',
      modalidades: ['GENERALISTA'],
      formasCobranca: ['HONORARIOS_CONTRATUAIS', 'OUTROS_A_COMBINAR'],
    });

    expect(payload.oabPrincipal).toMatchObject({
      numero: '123456',
      uf: 'SP',
      dataExpedicao: '2016-03-15',
      fotosUrls: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
    });
    expect(payload.oabsSuplementares).toHaveLength(1);
    expect(payload.oabsSuplementares?.[0]).toMatchObject({
      numero: '654321',
      uf: 'RJ',
      dataExpedicao: '2018-01-10',
      fotosUrls: ['tmp/advogados/oab/front2.jpg', 'tmp/advogados/oab/back2.jpg'],
    });
    expect(payload.areasAtuacao).toEqual([
      { estado: 'SP', cidade: 'Adamantina' },
      { estado: 'SP', cidade: 'Avaré' },
      { estado: 'RJ', cidade: 'Niterói' },
    ]);
    expect(payload.especialidades).toEqual([
      { especialidadeCodigo: 'CIVIL', subespecialidadeCodigo: 'CONTRATOS' },
      { especialidadeCodigo: 'IMOBILIARIO', subespecialidadeCodigo: 'DESPEJO' },
    ]);
    expect(payload.posGraduacoes).toEqual([
      { nomeCurso: 'LLM Direito Digital', instituicao: 'FGV', anoFormacao: 2020 },
    ]);
  });

  it('omits nomePai when noFatherName is checked', () => {
    const payload = mapLawyerSignupFormToRegisterRequest({
      ...baseForm,
      noFatherName: true,
    });

    expect(payload.nomePai).toBeUndefined();
  });

  it('omits incomplete OAB photo pairs (frente without verso)', () => {
    const payload = mapLawyerSignupFormToRegisterRequest({
      ...baseForm,
      oabPhotoKeys: ['tmp/advogados/oab/front-only.jpg'],
      supplementalOabs: [
        {
          number: '654321',
          uf: 'rj',
          issueDate: '10/01/2018',
          photoUris: ['file://one.jpg'],
          photoKeys: ['tmp/advogados/oab/one.jpg'],
        },
      ],
    });

    expect(payload.oabPrincipal.fotosUrls).toBeUndefined();
    expect(payload.oabsSuplementares?.[0]?.fotosUrls).toBeUndefined();
  });

  it('maps catalog codes', () => {
    expect(mapPracticeAreaToModalidade('none')).toBe('NENHUMA_DAS_ANTERIORES');
    expect(mapPracticeAreaToModalidade('pautista')).toBe('PAUTISTA');
    expect(mapBillingMethodToApi('court_awarded')).toBe('HONORARIOS_ARBITRADOS');
    expect(mapTreatmentPronounToApi('DOUTORA')).toBe('DOUTORA');
    expect(mapTreatmentPronounToApi('')).toBe('NEUTRO');
    expect(mapSpecialtiesToApi(['CIVIL:CONTRATOS'])).toEqual([
      { especialidadeCodigo: 'CIVIL', subespecialidadeCodigo: 'CONTRATOS' },
    ]);
  });

  it('maps general data name to the PATCH wire body', () => {
    expect(mapUpdateLawyerGeneralDataToWire({ fullName: '  João Advogado Lima  ' })).toEqual({
      nomeCompleto: 'João Advogado Lima',
    });
  });

  it('maps address form to the PATCH wire body', () => {
    expect(
      mapUpdateLawyerAddressToWire({
        cep: '01311100',
        state: 'sp',
        city: 'São Paulo',
        neighborhood: 'Consolação',
        street: 'Rua Augusta',
        number: '200',
        complement: 'Cj 10',
      }),
    ).toEqual({
      cep: '01311-100',
      estado: 'SP',
      cidade: 'São Paulo',
      bairro: 'Consolação',
      logradouro: 'Rua Augusta',
      numero: '200',
      complemento: 'Cj 10',
    });
  });

  it('maps billing methods to catalog codes', () => {
    expect(
      mapUpdateLawyerBillingToWire({
        billingMethods: ['percentage', 'court_awarded'],
      }),
    ).toEqual({
      formasCobranca: ['HONORARIOS_PERCENTUAIS', 'HONORARIOS_ARBITRADOS'],
    });
  });

  it('maps biography and treatment pronoun', () => {
    expect(
      mapUpdateLawyerBiographyToWire({
        pronouns: 'DOUTORA',
        biography: '  Advogada civilista.  ',
      }),
    ).toEqual({
      pronomeTratamento: 'DOUTORA',
      biografia: 'Advogada civilista.',
    });
  });

  it('maps documentation OABs to the PATCH wire body', () => {
    expect(
      mapUpdateLawyerDocumentationToWire({
        oabNumber: '123456',
        oabUf: 'sp',
        oabIssueDate: '15/03/2016',
        oabPhotoKeys: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
        supplementalOabs: [
          {
            number: '654321',
            uf: 'rj',
            issueDate: '10/01/2018',
            photoKeys: [],
          },
          { number: '  ', uf: 'BA', issueDate: '', photoKeys: [] },
        ],
      }),
    ).toEqual({
      oabPrincipal: {
        numero: '123456',
        uf: 'SP',
        dataExpedicao: '2016-03-15',
        fotosUrls: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
      },
      oabsSuplementares: [
        {
          numero: '654321',
          uf: 'RJ',
          dataExpedicao: '2018-01-10',
          fotosUrls: undefined,
        },
      ],
    });
  });

  it('maps profileUnavailable to disponibilidade', () => {
    expect(mapUpdateLawyerAvailabilityToWire({ profileUnavailable: true })).toEqual({
      disponibilidade: 'INDISPONIVEL',
    });
    expect(mapUpdateLawyerAvailabilityToWire({ profileUnavailable: false })).toEqual({
      disponibilidade: 'DISPONIVEL',
    });
  });

  it('maps graduation to the PATCH wire body', () => {
    expect(
      mapUpdateLawyerGraduationToWire({
        university: ' PUC-SP ',
        course: ' Direito ',
        graduationYear: '2018',
      }),
    ).toEqual({
      universidade: 'PUC-SP',
      curso: 'Direito',
      anoFormacao: 2018,
    });
  });
});
