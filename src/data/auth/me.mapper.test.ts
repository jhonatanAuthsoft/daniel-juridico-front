import { mapMeWireToResult, mergeAdvogadoDetalheIntoMe, mergeClienteDetalheIntoMe } from './me.mapper';

describe('mapMeWireToResult', () => {
  it('reads client photo key and push preference', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '1',
          email: 'a@b.com',
          nomeCompleto: 'A',
          perfil: 'CLIENTE',
          notificacoesPushHabilitadas: true,
        },
        cliente: {
          perfil: { fotoUrl: 'tmp/clientes/perfil/abc.jpg' },
        },
      }),
    ).toEqual(
      expect.objectContaining({
        photoKey: 'tmp/clientes/perfil/abc.jpg',
        pushNotificationsEnabled: true,
      }),
    );
  });

  it('reads lawyer photo key when client is absent', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '2',
          email: 'adv@b.com',
          nomeCompleto: 'B',
          perfil: 'ADVOGADO',
          notificacoesPushHabilitadas: false,
        },
        advogado: {
          perfil: { fotoUrl: 'tmp/advogados/perfil/xyz.png' },
        },
      }),
    ).toEqual(
      expect.objectContaining({
        photoKey: 'tmp/advogados/perfil/xyz.png',
        pushNotificationsEnabled: false,
        clientProfile: null,
      }),
    );
  });

  it('returns null photo and defaults push on when fotoUrl is blank', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '3',
          email: 'c@b.com',
          nomeCompleto: 'C',
          perfil: 'CLIENTE',
        },
        cliente: { perfil: { fotoUrl: '  ' } },
      }),
    ).toEqual(
      expect.objectContaining({
        photoKey: null,
        pushNotificationsEnabled: true,
      }),
    );
  });

  it('maps client CPF profile and address into edit-form fields', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '1',
          email: 'maria@laweact.com',
          nomeCompleto: 'Maria Silva',
          perfil: 'CLIENTE',
          notificacoesPushHabilitadas: true,
        },
        cliente: {
          perfil: {
            fotoUrl: 'tmp/clientes/perfil/abc.jpg',
            nomeCompleto: 'Maria Silva',
            profissao: 'Analista',
            tipoDocumento: 'CPF',
            numeroDocumento: '11144477735',
            rg: '1234567',
            pronomes: 'ELA',
            faixaRenda: '1500',
            estadoCivil: 'casado',
          },
          endereco: {
            cep: '01310-100',
            logradouro: 'Av. Paulista',
            numero: '1000',
            complemento: 'Apto 12',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'SP',
          },
        },
      }),
    ).toEqual({
      photoKey: 'tmp/clientes/perfil/abc.jpg',
      pushNotificationsEnabled: true,
      clientProfile: {
        fullName: 'Maria Silva',
        email: 'maria@laweact.com',
        documentType: 'cpf',
        documentNumber: '111.444.777-35',
        rg: '12.345.67',
        cep: '01310-100',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Bela Vista',
        street: 'Av. Paulista',
        number: '1000',
        complement: 'Apto 12',
        pronouns: 'ELA',
        profession: 'Analista',
        maritalStatus: 'casado',
        monthlyIncome: '1500',
      },
      lawyerProfile: null,
    });
  });

  it('maps client CNPJ using razao social and hides personal RG', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '9',
          email: 'empresa@laweact.com',
          nomeCompleto: 'Empresa Exemplo LTDA',
          perfil: 'CLIENTE',
        },
        cliente: {
          perfil: {
            razaoSocial: 'Empresa Exemplo LTDA',
            areaAtuacao: 'Tecnologia',
            tipoDocumento: 'CNPJ',
            numeroDocumento: '11222333000181',
            pronomes: 'NEUTRO',
          },
          endereco: {
            cep: '01310100',
            logradouro: 'Av. Paulista',
            numero: '1000',
            complemento: 'Sala 200',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'sp',
          },
        },
      }).clientProfile,
    ).toEqual({
      fullName: 'Empresa Exemplo LTDA',
      email: 'empresa@laweact.com',
      documentType: 'cnpj',
      documentNumber: '11.222.333/0001-81',
      rg: '',
      cep: '01310-100',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Bela Vista',
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 200',
      pronouns: 'NEUTRO',
      profession: 'Tecnologia',
      maritalStatus: '',
      monthlyIncome: '',
    });
  });

  it('merges PATCH /clientes/me response into the cached /me profile', () => {
    const current = mapMeWireToResult({
      usuario: {
        id: '1',
        email: 'maria@laweact.com',
        nomeCompleto: 'Maria Silva',
        perfil: 'CLIENTE',
        notificacoesPushHabilitadas: true,
      },
      cliente: {
        perfil: {
          fotoUrl: 'tmp/clientes/perfil/abc.jpg',
          nomeCompleto: 'Maria Silva',
          tipoDocumento: 'CPF',
          numeroDocumento: '11144477735',
          rg: '1234567',
          pronomes: 'ELA',
          profissao: 'Analista',
        },
        endereco: {
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      },
    });

    expect(
      mergeClienteDetalheIntoMe(current, {
        perfil: {
          fotoUrl: 'tmp/clientes/perfil/abc.jpg',
          nomeCompleto: 'Maria Silva Lima',
          tipoDocumento: 'CPF',
          numeroDocumento: '11144477735',
          rg: '1234567',
          pronomes: 'ELE',
          profissao: 'Designer',
          estadoCivil: 'solteiro',
          faixaRenda: '2500',
        },
        endereco: {
          cep: '01311-100',
          logradouro: 'Rua Augusta',
          numero: '200',
          complemento: 'Cj 10',
          bairro: 'Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      }),
    ).toEqual({
      photoKey: 'tmp/clientes/perfil/abc.jpg',
      pushNotificationsEnabled: true,
      clientProfile: {
        fullName: 'Maria Silva Lima',
        email: 'maria@laweact.com',
        documentType: 'cpf',
        documentNumber: '111.444.777-35',
        rg: '12.345.67',
        cep: '01311-100',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Consolação',
        street: 'Rua Augusta',
        number: '200',
        complement: 'Cj 10',
        pronouns: 'ELE',
        profession: 'Designer',
        maritalStatus: 'solteiro',
        monthlyIncome: '2500',
      },
      lawyerProfile: null,
    });
  });

  it('returns null client profile for lawyers', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '2',
          email: 'adv@b.com',
          nomeCompleto: 'B',
          perfil: 'ADVOGADO',
          notificacoesPushHabilitadas: false,
        },
        advogado: {
          perfil: { fotoUrl: 'tmp/advogados/perfil/xyz.png' },
        },
      }).clientProfile,
    ).toBeNull();
  });

  it('maps lawyer detalhe into edit-form fields', () => {
    expect(
      mapMeWireToResult({
        usuario: {
          id: '2',
          email: 'joao@laweact.com',
          nomeCompleto: 'João Advogado',
          perfil: 'ADVOGADO',
          notificacoesPushHabilitadas: true,
        },
        advogado: {
          perfil: {
            fotoUrl: 'tmp/advogados/perfil/joao.jpg',
            nomeCompleto: 'João Advogado',
            pronomeTratamento: 'DOUTOR',
            biografia: 'Atuo há 10 anos.',
            universidade: 'USP',
            curso: 'Direito',
            anoFormacao: 2015,
          },
          endereco: {
            cep: '01310100',
            logradouro: 'Av. Paulista',
            numero: '1500',
            complemento: 'Conjunto 41',
            bairro: 'Bela Vista',
            cidade: 'São Paulo',
            estado: 'sp',
          },
          oabs: [
            {
              numero: '123456',
              uf: 'SP',
              principal: true,
              dataExpedicao: '2016-03-15',
              fotosUrls: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
            },
            {
              numero: '654321',
              uf: 'RJ',
              principal: false,
              dataExpedicao: '2018-01-10',
              fotosUrls: [],
            },
          ],
          formasCobranca: [
            { codigo: 'HONORARIOS_CONTRATUAIS', nome: 'Honorários Contratuais' },
            { codigo: 'HONORARIOS_PERCENTUAIS', nome: 'Honorários Percentuais' },
            { codigo: 'HONORARIOS_ARBITRADOS', nome: 'Honorários arbitrados' },
          ],
        },
      }),
    ).toEqual({
      photoKey: 'tmp/advogados/perfil/joao.jpg',
      pushNotificationsEnabled: true,
      clientProfile: null,
      lawyerProfile: {
        fullName: 'João Advogado',
        email: 'joao@laweact.com',
        cep: '01310-100',
        state: 'SP',
        city: 'São Paulo',
        neighborhood: 'Bela Vista',
        street: 'Av. Paulista',
        number: '1500',
        complement: 'Conjunto 41',
        billingMethods: ['contractual', 'percentage', 'court_awarded'],
        biography: 'Atuo há 10 anos.',
        pronouns: 'DOUTOR',
        oabNumber: '123456',
        oabUf: 'SP',
        oabIssueDate: '15/03/2016',
        oabPhotoUris: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
        oabPhotoKeys: ['tmp/advogados/oab/front.jpg', 'tmp/advogados/oab/back.jpg'],
        supplementalOabs: [
          {
            number: '654321',
            uf: 'RJ',
            issueDate: '10/01/2018',
            photoUris: [],
            photoKeys: [],
          },
        ],
        university: 'USP',
        course: 'Direito',
        graduationYear: '2015',
      },
    });
  });

  it('merges PATCH /advogados/me response into the cached /me profile', () => {
    const current = mapMeWireToResult({
      usuario: {
        id: '2',
        email: 'joao@laweact.com',
        nomeCompleto: 'João Advogado',
        perfil: 'ADVOGADO',
        notificacoesPushHabilitadas: true,
      },
      advogado: {
        perfil: {
          fotoUrl: 'tmp/advogados/perfil/joao.jpg',
          nomeCompleto: 'João Advogado',
          pronomeTratamento: 'DOUTOR',
          biografia: 'Atuo há 10 anos.',
          universidade: 'USP',
          curso: 'Direito',
          anoFormacao: 2015,
        },
        endereco: {
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1500',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      },
    });

    expect(
      mergeAdvogadoDetalheIntoMe(current, {
        perfil: {
          fotoUrl: 'tmp/advogados/perfil/joao.jpg',
          nomeCompleto: 'João Advogado Lima',
          pronomeTratamento: 'DOUTORA',
          biografia: 'Advogada civilista.',
          universidade: 'PUC-SP',
          curso: 'Direito',
          anoFormacao: 2018,
        },
        endereco: {
          cep: '01311-100',
          logradouro: 'Rua Augusta',
          numero: '200',
          complemento: 'Cj 10',
          bairro: 'Consolação',
          cidade: 'São Paulo',
          estado: 'SP',
        },
        formasCobranca: [
          { codigo: 'HONORARIOS_PERCENTUAIS', nome: 'Honorários percentuais' },
        ],
      }),
    ).toEqual(
      expect.objectContaining({
        photoKey: 'tmp/advogados/perfil/joao.jpg',
        pushNotificationsEnabled: true,
        clientProfile: null,
        lawyerProfile: expect.objectContaining({
          fullName: 'João Advogado Lima',
          email: 'joao@laweact.com',
          street: 'Rua Augusta',
          neighborhood: 'Consolação',
          billingMethods: ['percentage'],
          biography: 'Advogada civilista.',
          pronouns: 'DOUTORA',
          university: 'PUC-SP',
          graduationYear: '2018',
        }),
      }),
    );
  });
});
