import { useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { SymbolView } from 'expo-symbols';

import { XIcon } from '@/assets/icon/x';
import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { InputCaption, InputLabel } from '@/atomic/typography';
import type { InputValidatorPattern } from '@/constants/input-validators';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export type InputTextFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  validators?: InputValidatorPattern[];
  tooltipText?: string;
  placeholder?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

function runValidators(value: string, validators: InputValidatorPattern[] = []) {
  for (const pattern of validators) {
    if (!pattern.test(value)) {
      return 'Valor inválido';
    }
  }
  return true;
}

export function InputTextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  validators = [],
  tooltipText,
  placeholder,
  iconLeft,
  iconRight,
  ...textInputProps
}: InputTextFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => runValidators(String(value ?? ''), validators),
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const hasError = Boolean(error?.message);

        return (
          <View style={styles.container}>
            <View style={styles.labelRow}>
              <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
              {tooltipText ? (
                <View style={styles.tooltipAnchor}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Mais informações"
                    hitSlop={Spacing.xxs}
                    onPress={() => setTooltipVisible((visible) => !visible)}>
                    <SymbolView
                      name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                      size={16}
                      tintColor={BrandColors.neutral.light}
                    />
                  </Pressable>
                  {tooltipVisible ? (
                    <View style={styles.tooltipBalloon}>
                      <InputCaption color={BrandColors.neutral.white}>{tooltipText}</InputCaption>
                    </View>
                  ) : null}
                </View>
              ) : null}
            </View>

            <Separator size="xxs" />

            <View style={[styles.fieldShell, hasError && styles.fieldShellError]}>
              <GlassBackground blurPx={25} />
              <View style={styles.fieldContent}>
                {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
                <TextInput
                  {...textInputProps}
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  placeholderTextColor={BrandColors.neutral.light}
                  style={[styles.input, textInputProps.style]}
                />
                {iconRight ? <View style={styles.iconRight}>{iconRight}</View> : null}
              </View>
            </View>

            {hasError ? (
              <>
                <Separator size="xxxs" />
                <View style={styles.errorRow}>
                  <XIcon color={BrandColors.feedback.error.medium} />
                  <InputCaption color={BrandColors.feedback.error.light}>
                    {error?.message}
                  </InputCaption>
                </View>
              </>
            ) : null}
          </View>
        );
      }}
    />
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
  container: {
    width: '100%',
    alignSelf: 'stretch',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
  tooltipAnchor: {
    position: 'relative',
    zIndex: 2,
  },
  tooltipBalloon: {
    position: 'absolute',
    left: 0,
    top: Spacing.sm,
    minWidth: 160,
    maxWidth: 220,
    paddingHorizontal: Spacing.xxs,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.small,
    backgroundColor: BrandColors.neutral.xdark,
  },
  fieldShell: {
    alignSelf: 'stretch',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
  },
  fieldShellError: {
    borderWidth: 1.8,
    borderColor: BrandColors.feedback.error.medium,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    color: BrandColors.neutral.white,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  iconRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
