import { Controller, useFormContext } from 'react-hook-form';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { GlassBackground } from '@/atomic/glass';
import { Body1 } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues } from '../types';

const BILLING_OPTIONS = [
  {
    id: 'contractual',
    label: 'Honorários contratuais',
  },
  {
    id: 'percentage',
    label: 'Honorários percentuais',
  },
  {
    id: 'court_awarded',
    label: 'Honorários arbitrados judicialmente',
  },
  {
    id: 'to_be_agreed',
    label: 'A combinar',
  },
] as const;

export function StepBilling() {
  const { control } = useFormContext<LawyerSignupFormValues>();

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <Controller
        control={control}
        name="billingMethods"
        render={({ field: { value, onChange } }) => {
          const selected = value ?? [];

          const toggle = (id: string) => {
            if (selected.includes(id)) {
              onChange(selected.filter((item) => item !== id));
              return;
            }
            onChange([...selected, id]);
          };

          return (
            <View style={styles.list}>
              {BILLING_OPTIONS.map((option) => {
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
                      <Body1 color={BrandColors.neutral.white} style={styles.optionLabel}>
                        {option.label}
                      </Body1>
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
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: BrandColors.neutral.white,
  },
  checkboxChecked: {
    backgroundColor: BrandColors.primary.light,
    borderColor: BrandColors.primary.light,
  },
  optionLabel: {
    flex: 1,
  },
});
