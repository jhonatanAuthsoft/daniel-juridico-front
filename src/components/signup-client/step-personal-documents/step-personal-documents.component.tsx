import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { InputSelectField } from '@/atomic/form/input-select-field.component';
import { InputTextField } from '@/atomic/form/input-text-field.component';
import { Separator } from '@/atomic/separator';
import { Body1, InputLabel } from '@/atomic/typography';
import { FieldValidators } from '@/constants/field-validators';
import { InputMasks } from '@/constants/input-masks';
import { ISSUING_AUTHORITY_OPTIONS, UF_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { signupClientSharedStyles } from '../shared.styles';
import type { ClientPersonType, ClientSignupFormValues } from '../types';

const PERSON_TYPE_OPTIONS: { value: ClientPersonType; label: string }[] = [
  { value: 'cpf', label: 'CPF' },
  { value: 'cnpj', label: 'CNPJ' },
];

function PersonTypeToggle() {
  const { control } = useFormContext<ClientSignupFormValues>();

  return (
    <Controller
      control={control}
      name="personType"
      render={({ field: { value, onChange } }) => (
        <View style={styles.toggle}>
          {PERSON_TYPE_OPTIONS.map((option) => {
            const selected = value === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
                onPress={() => onChange(option.value)}
                style={({ pressed }) => [
                  styles.toggleOption,
                  selected && styles.toggleOptionSelected,
                  pressed && styles.toggleOptionPressed,
                ]}>
                <Body1 color={BrandColors.neutral.white}>{option.label}</Body1>
              </Pressable>
            );
          })}
        </View>
      )}
    />
  );
}

export function StepPersonalDocuments() {
  const personType = useWatch<ClientSignupFormValues, 'personType'>({
    name: 'personType',
  });
  const isCnpj = personType === 'cnpj';

  return (
    <View style={signupClientSharedStyles.fields}>
      <PersonTypeToggle />

      {isCnpj ? (
        <>
          <InputTextField
            name="fullName"
            label="Razão Social"
            placeholder="Empresa Exemplo LTDA"
            autoCapitalize="words"
            validate={FieldValidators.required()}
          />
          <InputTextField
            name="cnpj"
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            keyboardType="number-pad"
            format={InputMasks.cnpj}
            validate={FieldValidators.cnpj}
            maxLength={18}
          />
          <InputTextField
            name="businessArea"
            label="Área de atuação"
            placeholder="Digite a área de atuação"
            autoCapitalize="sentences"
            validate={FieldValidators.required()}
          />
        </>
      ) : (
        <>
          <InputTextField
            name="fullName"
            label="Nome completo (nome social)"
            placeholder="Maria Gomes Silva"
            autoCapitalize="words"
            autoComplete="name"
            textContentType="name"
            validate={FieldValidators.required()}
          />
          <InputTextField
            name="rg"
            label="RG"
            placeholder="84587810"
            keyboardType="number-pad"
            format={InputMasks.digitsMax(12)}
            validate={FieldValidators.digitsMin(5, 'RG inválido')}
            maxLength={12}
          />
          <View>
            <InputLabel color={BrandColors.neutral.white}>
              Órgão Emissor e UF
            </InputLabel>
            <Separator size="xxs" />
            <View style={styles.row}>
              <View style={styles.rowItemGrow}>
                <InputSelectField
                  name="issuingAuthority"
                  placeholder="SSP"
                  options={ISSUING_AUTHORITY_OPTIONS}
                  required
                />
              </View>
              <View style={styles.rowItemUf}>
                <InputSelectField
                  name="uf"
                  placeholder="BA"
                  options={UF_OPTIONS}
                  required
                />
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
          <InputTextField
            name="birthDate"
            label="Data de Nascimento"
            placeholder="00/00/0000"
            keyboardType="number-pad"
            format={InputMasks.dateBr}
            validate={FieldValidators.dateBr}
            maxLength={10}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    padding: Spacing.xxxs,
    borderRadius: Radius.large,
    backgroundColor: BrandColors.accessory.darkGray,
  },
  toggleOption: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  toggleOptionSelected: {
    borderColor: BrandColors.neutral.light,
  },
  toggleOptionPressed: {
    opacity: 0.85,
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
