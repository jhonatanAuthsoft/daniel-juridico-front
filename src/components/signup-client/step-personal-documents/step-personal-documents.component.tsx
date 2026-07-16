import { StyleSheet, View } from 'react-native';

import { InputSelectField, InputTextField } from '@/atomic/form';
import { ISSUING_AUTHORITY_OPTIONS, UF_OPTIONS } from '@/constants/select-options';
import { Spacing } from '@/constants/theme';

import { signupClientSharedStyles } from '../shared.styles';

export function StepPersonalDocuments() {
  return (
    <View style={signupClientSharedStyles.fields}>
      <InputTextField
        name="fullName"
        label="Nome completo (nome social)"
        placeholder="Maria Gomes Silva"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
      />
      <InputTextField name="rg" label="RG" placeholder="84587810" keyboardType="number-pad" />
      <View style={styles.row}>
        <View style={styles.rowItemGrow}>
          <InputSelectField
            name="issuingAuthority"
            label="Órgão Emissor"
            placeholder="SSP"
            options={ISSUING_AUTHORITY_OPTIONS}
          />
        </View>
        <View style={styles.rowItemUf}>
          <InputSelectField name="uf" label="UF" placeholder="BA" options={UF_OPTIONS} />
        </View>
      </View>
      <InputTextField
        name="cpf"
        label="CPF"
        placeholder="78524414-15"
        keyboardType="number-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  rowItemGrow: {
    flex: 1,
  },
  rowItemUf: {
    width: 112,
  },
});
