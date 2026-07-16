import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { InputTextField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body2, InputLabel } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { SelectFieldShell } from '../select-field-shell';
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
      />

      <View>
        <InputTextField
          name="fatherName"
          label="Nome de pai"
          placeholder="Digite o nome do seu pai"
          autoCapitalize="words"
          editable={!noFatherName}
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
              <View style={[styles.checkbox, value ? styles.checkboxChecked : null]} />
              <Body2 color={BrandColors.neutral.white}>Não consta nome de pai</Body2>
            </Pressable>
          )}
        />
      </View>

      <InputTextField name="rg" label="RG" placeholder="000.000.00-00" keyboardType="number-pad" />

      <View>
        <InputLabel color={BrandColors.neutral.white}>Órgão Emissor e UF</InputLabel>
        <Separator size="xxs" />
        <View style={styles.row}>
          <View style={styles.rowItemGrow}>
            <SelectFieldShell name="issuingAuthority" placeholder="SSP" />
          </View>
          <View style={styles.rowItemUf}>
            <SelectFieldShell name="uf" placeholder="BA" />
          </View>
        </View>
      </View>

      <InputTextField name="cpf" label="CPF" placeholder="000.000.00-00" keyboardType="number-pad" />
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: BrandColors.neutral.white,
  },
  checkboxChecked: {
    backgroundColor: BrandColors.primary.light,
    borderColor: BrandColors.primary.light,
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
