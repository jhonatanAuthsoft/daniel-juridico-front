import { Controller, useFormContext } from 'react-hook-form';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { GlassBackground } from '@/atomic/glass';
import { Body1, InputCaption } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

const NONE_ID = 'none';

const PRACTICE_OPTIONS = [
  {
    id: 'pautista',
    label: 'Pautista',
  },
  {
    id: 'generalista',
    label: 'Generalista',
    description: 'Todas as especialidades do direito',
  },
  {
    id: 'consultor',
    label: 'Consultor',
  },
  {
    id: 'correspondente',
    label: 'Correspondente / Outras atividades',
  },
  {
    id: NONE_ID,
    label: 'Nenhuma das anteriores',
    description: 'Selecione as especialidades a seguir.',
  },
] as const;

export function StepPracticeAreas() {
  const { control } = useFormContext<LawyerSignupFormValues>();

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <Controller
        control={control}
        name="practiceAreas"
        render={({ field: { value, onChange } }) => {
          const selected = value ?? [];

          const toggle = (id: string) => {
            const isSelected = selected.includes(id);

            if (id === NONE_ID) {
              onChange(isSelected ? [] : [NONE_ID]);
              return;
            }

            const withoutNone = selected.filter((item) => item !== NONE_ID);
            if (isSelected) {
              onChange(withoutNone.filter((item) => item !== id));
              return;
            }
            onChange([...withoutNone, id]);
          };

          return (
            <View style={styles.list}>
              {PRACTICE_OPTIONS.map((option) => {
                const checked = selected.includes(option.id);

                return (
                  <Pressable
                    key={option.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    onPress={() => toggle(option.id)}
                    style={({ pressed }) => [
                      styles.optionShell,
                      pressed && styles.optionPressed,
                    ]}>
                    <GlassBackground blurPx={25} />
                    <View style={styles.optionContent}>
                      <View style={[styles.checkbox, checked && styles.checkboxChecked]} />
                      <View style={styles.optionText}>
                        <Body1 color={BrandColors.neutral.white}>{option.label}</Body1>
                        {'description' in option && option.description ? (
                          <InputCaption color={BrandColors.neutral.light}>
                            {option.description}
                          </InputCaption>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        }}
      />
    </View>
  );
}

const glassShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
});

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
    width: '100%',
  },
  optionShell: {
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
  },
  optionPressed: {
    opacity: 0.88,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: BrandColors.neutral.white,
  },
  checkboxChecked: {
    backgroundColor: BrandColors.primary.light,
    borderColor: BrandColors.primary.light,
  },
  optionText: {
    flex: 1,
    gap: Spacing.xxxs,
  },
});
