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
import type { FieldValidateFn } from '@/constants/field-validators';
import type { InputValidatorPattern } from '@/constants/input-validators';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

export type InputTextFieldProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label?: string;
  /** Legacy regex validators (message: "Valor inválido"). Prefer `validate`. */
  validators?: InputValidatorPattern[];
  /** Custom validator(s) with specific error messages. */
  validate?: FieldValidateFn | FieldValidateFn[];
  /** Transforms raw text before storing in the form (masks, digits-only, etc.). */
  format?: (text: string) => string;
  tooltipText?: string;
  placeholder?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'>;

function runRegexValidators(value: string, validators: InputValidatorPattern[] = []) {
  for (const pattern of validators) {
    if (!pattern.test(value)) {
      return 'Valor inválido';
    }
  }
  return true as const;
}

function runValidateFns(
  value: string,
  validate?: FieldValidateFn | FieldValidateFn[],
): Promise<true | string> | true | string {
  if (!validate) {
    return true;
  }
  const list = Array.isArray(validate) ? validate : [validate];

  const run = async (): Promise<true | string> => {
    for (const fn of list) {
      const result = await fn(value);
      if (result !== true) {
        return result;
      }
    }
    return true;
  };

  return run();
}

export function InputTextField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  validators = [],
  validate,
  format,
  tooltipText,
  placeholder,
  iconLeft,
  iconRight,
  ...textInputProps
}: InputTextFieldProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const isMultiline = Boolean(textInputProps.multiline);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: async (value) => {
          const text = String(value ?? '');
          const custom = await runValidateFns(text, validate);
          if (custom !== true) {
            return custom;
          }
          return runRegexValidators(text, validators);
        },
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const hasError = Boolean(error?.message);
        const isDisabled = textInputProps.editable === false;

        return (
          <View style={styles.container}>
            {label ? (
              <>
                <View style={styles.labelRow}>
                  <InputLabel
                    color={
                      isDisabled ? BrandColors.neutral.medium : BrandColors.neutral.white
                    }>
                    {label}
                  </InputLabel>
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
              </>
            ) : null}

            <View
              style={[
                styles.fieldShell,
                hasError && styles.fieldShellError,
                isDisabled && styles.fieldShellDisabled,
              ]}>
              <GlassBackground blurPx={25} />
              <View style={[styles.fieldContent, isMultiline && styles.fieldContentMultiline]}>
                {iconLeft ? <View style={styles.iconLeft}>{iconLeft}</View> : null}
                <TextInput
                  {...textInputProps}
                  value={value ?? ''}
                  onChangeText={(text) => {
                    onChange(format ? format(text) : text);
                  }}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  placeholderTextColor={
                    isDisabled ? BrandColors.neutral.medium : BrandColors.neutral.light
                  }
                  underlineColorAndroid="transparent"
                  textAlignVertical={isMultiline ? 'top' : textInputProps.textAlignVertical}
                  style={[
                    styles.input,
                    isMultiline && styles.inputMultiline,
                    isDisabled && styles.inputDisabled,
                    textInputProps.style,
                  ]}
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
    // elevation + non-solid fill paints the gray plate on Android.
    elevation: 0,
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
    backgroundColor: BrandColors.neutral.xdark,
    ...glassShadow,
  },
  fieldShellError: {
    borderWidth: 1.8,
    borderColor: BrandColors.feedback.error.medium,
  },
  fieldShellDisabled: {
    opacity: 0.5,
    borderColor: BrandColors.neutral.medium,
  },
  fieldContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
  },
  fieldContentMultiline: {
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    padding: 0,
    margin: 0,
    color: BrandColors.neutral.white,
    fontSize: 16,
    // Android keeps a default EditText fill unless this is forced transparent.
    backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0)' : 'transparent',
  },
  inputDisabled: {
    color: BrandColors.neutral.medium,
  },
  inputMultiline: {
    minHeight: 120,
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
