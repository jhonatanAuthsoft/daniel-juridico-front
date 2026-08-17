import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { InputSelectField, InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body2, InputLabel } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { ISSUING_AUTHORITY_OPTIONS, UF_OPTIONS } from '@/constants/select-options';
import { BrandColors, Spacing } from '@/constants/theme';

import { OptionCheckbox } from '../selectable-option';
import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

export function StepDocumentation() {
  const { control, setValue } = useFormContext<LawyerSignupFormValues>();
  const noFatherName = useWatch<LawyerSignupFormValues, 'noFatherName'>({
    name: 'noFatherName',
  });

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <InputTextField
        name="motherName"
        label="Nome de mãe"
        placeholder="Digite o nome da sua mãe"
        autoCapitalize="words"
        validate={FieldValidators.required()}
      />

      <View>
        <InputTextField
          name="fatherName"
          label="Nome de pai"
          placeholder={
            noFatherName ? 'Não consta nome de pai' : 'Digite o nome do seu pai'
          }
          autoCapitalize="words"
          editable={!noFatherName}
          validate={
            noFatherName
              ? undefined
              : FieldValidators.required('Informe o nome do pai ou marque a opção abaixo')
          }
        />
        <Separator size="xxs" />
        <Controller
          control={control}
          name="noFatherName"
          render={({ field: { value, onChange } }) => (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: Boolean(value) }}
              onPress={() => {
                const next = !value;
                onChange(next);
                if (next) {
                  setValue('fatherName', '');
                }
              }}
              style={styles.checkboxRow}>
              <OptionCheckbox checked={Boolean(value)} />
              <Body2 color={BrandColors.neutral.white}>Não consta nome de pai</Body2>
            </Pressable>
          )}
        />
      </View>

      <InputTextField
        name="rg"
        label="RG"
        placeholder="00.000.000-0"
        keyboardType="number-pad"
        format={InputMasks.rg}
        validate={FieldValidators.rg}
        maxLength={12}
      />

      <View>
        <InputLabel color={BrandColors.neutral.white}>Órgão Emissor e UF</InputLabel>
        <Separator size="xxs" />
        <View style={styles.row}>
          <View style={styles.rowItemGrow}>
            <InputSelectField
              name="issuingAuthority"
              placeholder="Selecione"
              options={ISSUING_AUTHORITY_OPTIONS}
              searchable={false}
              required
            />
          </View>
          <View style={styles.rowItemUf}>
            <InputSelectField name="uf" placeholder="UF" options={UF_OPTIONS} required />
          </View>
        </View>
      </View>

      <InputTextField
        name="cpf"
        label="CPF"
        placeholder="000.000.000-00"
        keyboardType="number-pad"
        format={InputMasks.cpf}
        validate={FieldValidators.cpf}
        maxLength={14}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
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
