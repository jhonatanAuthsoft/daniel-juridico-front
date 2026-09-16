import { getClientSignupStepCopy } from './constants';
import { getClientSignupStepFields } from './step-fields';

describe('getClientSignupStepFields', () => {
  it('requires profession for CPF and monthly income for CPF and CNPJ', () => {
    expect(getClientSignupStepFields(4, 'cpf')).toEqual(['profession', 'monthlyIncome']);
    expect(getClientSignupStepFields(4, 'cnpj')).toEqual(['monthlyIncome']);
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
