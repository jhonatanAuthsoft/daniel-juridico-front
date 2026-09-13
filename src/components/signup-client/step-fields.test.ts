import { getClientSignupStepCopy } from './constants';
import { getClientSignupStepFields } from './step-fields';

describe('getClientSignupStepFields', () => {
  it('requires profession on the about-you step only for CPF', () => {
    expect(getClientSignupStepFields(4, 'cpf')).toEqual(['profession']);
    expect(getClientSignupStepFields(4, 'cnpj')).toEqual([]);
  });
});

describe('getClientSignupStepCopy', () => {
  it('uses the company title on step 4 for CNPJ', () => {
    expect(getClientSignupStepCopy(4, 'cnpj')).toEqual({
      title: 'Sobre a Empresa',
      subtitle: 'Personalize seu perfil público e facilite conexão',
    });
  });

  it('keeps the personal title on step 4 for CPF', () => {
    expect(getClientSignupStepCopy(4, 'cpf').title).toBe('Sobre Você');
  });
});
