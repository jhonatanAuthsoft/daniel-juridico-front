import { getClientSignupStepFields } from './step-fields';

describe('getClientSignupStepFields', () => {
  it('requires profession on the about-you step only for CPF', () => {
    expect(getClientSignupStepFields(4, 'cpf')).toEqual(['profession']);
    expect(getClientSignupStepFields(4, 'cnpj')).toEqual([]);
  });
});
