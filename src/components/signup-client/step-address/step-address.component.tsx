import { View } from 'react-native';

import { InputTextField } from '@/atomic/form';

import { SelectFieldShell } from '../select-field-shell';
import { signupClientSharedStyles } from '../shared.styles';

export function StepAddress() {
  return (
    <View style={signupClientSharedStyles.fields}>
      <InputTextField
        name="cep"
        label="CEP"
        placeholder="Digite seu CEP"
        keyboardType="number-pad"
        textContentType="postalCode"
      />
      <SelectFieldShell name="state" label="Estado" placeholder="Selecione o estado" />
      <SelectFieldShell name="city" label="Cidade" placeholder="Selecione a cidade" />
      <SelectFieldShell name="neighborhood" label="Bairro" placeholder="Selecione o bairro" />
      <InputTextField name="street" label="Logradouro" placeholder="Digite o endereço" />
      <InputTextField name="number" label="Número" placeholder="Ex 12" keyboardType="number-pad" />
      <InputTextField name="complement" label="Complemento" placeholder="Ex. Casa" />
    </View>
  );
}
