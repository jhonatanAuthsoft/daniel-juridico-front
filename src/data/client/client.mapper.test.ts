import {
  mapClientSignupFormToRegisterRequest,
  mapPronounsToApi,
  toIsoBirthDate,
} from './client.mapper';
import type { ClientSignupFormValues } from '@/components/signup-client';

const baseForm: ClientSignupFormValues = {
  email: 'maria@laweact.com',
  phone: '(11) 99999-9999',
  password: 'Secret12',
  personType: 'cpf',
  fullName: 'Maria Silva',
  rg: '1234567',
  issuingAuthority: 'SSP',
  uf: 'SP',
  cpf: '529.982.247-25',
  cnpj: '',
  businessArea: '',
  birthDate: '20/05/1990',
  cep: '01310-100',
  state: 'sp',
  city: 'São Paulo',
  neighborhood: 'Bela Vista',
  street: 'Av. Paulista',
  number: '1000',
  complement: 'Apto 12',
  maritalStatus: 'solteiro',
  profession: 'Analista',
  monthlyIncome: '5000',
  pronouns: 'ELA',
  profileImageUri: 'file://local.jpg',
  profileImageKey: 'tmp/clientes/perfil/abc.jpg',
};

describe('client.mapper', () => {
  it('maps CPF form to API payload', () => {
    const payload = mapClientSignupFormToRegisterRequest(baseForm);

    expect(payload).toMatchObject({
      email: 'maria@laweact.com',
      tipoDocumento: 'CPF',
      numeroDocumento: '52998224725',
      nomeCompleto: 'Maria Silva',
      rg: '1234567',
      rgOrgaoEmissor: 'SSP',
      rgUf: 'SP',
      dataNascimento: '1990-05-20',
      pronomes: 'ELA',
      telefone: '11999999999',
      estado: 'SP',
      fotoUrl: 'tmp/clientes/perfil/abc.jpg',
    });
  });

  it('maps CNPJ form with business area', () => {
    const payload = mapClientSignupFormToRegisterRequest({
      ...baseForm,
      personType: 'cnpj',
      fullName: 'Empresa Exemplo LTDA',
      cnpj: '12.345.678/0001-95',
      businessArea: 'Tecnologia',
      cpf: '',
      rg: '',
      birthDate: '',
      profession: '',
    });

    expect(payload.tipoDocumento).toBe('CNPJ');
    expect(payload.razaoSocial).toBe('Empresa Exemplo LTDA');
    expect(payload.areaAtuacao).toBe('Tecnologia');
    expect(payload.numeroDocumento).toBe('12345678000195');
    expect(payload.rgOrgaoEmissor).toBeUndefined();
    expect(payload.rgUf).toBeUndefined();
  });

  it('omits fotoUrl when the client does not upload a profile photo', () => {
    const payload = mapClientSignupFormToRegisterRequest({
      ...baseForm,
      profileImageUri: '',
      profileImageKey: '',
    });

    expect(payload.fotoUrl).toBeUndefined();
  });

  it('parses birth dates and pronouns', () => {
    expect(toIsoBirthDate('20/05/1990')).toBe('1990-05-20');
    expect(mapPronounsToApi('ELE')).toBe('ELE');
    expect(mapPronounsToApi('ELA')).toBe('ELA');
    expect(mapPronounsToApi('NEUTRO')).toBe('NEUTRO');
  });
});
