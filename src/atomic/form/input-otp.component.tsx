import { useRef } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

import { GlassBackground } from '@/atomic/glass';
import { Separator } from '@/atomic/separator';
import { InputLabel } from '@/atomic/typography';
import { BrandColors, Radius, Spacing } from '@/constants/theme';

const DEFAULT_LENGTH = 4;
const CELL_SIZE = 64;

export type InputOTPProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  label: string;
  length?: number;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export function InputOTP<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  length = DEFAULT_LENGTH,
}: InputOTPProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  const inputRefs = useRef<Array<TextInput | null>>(Array.from({ length }, () => null));

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        validate: (value) => {
          const digits = onlyDigits(String(value ?? ''));
          if (digits.length !== length) {
            return 'Código incompleto';
          }
          return true;
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => {
        const digits = onlyDigits(String(value ?? '')).slice(0, length).split('');
        while (digits.length < length) {
          digits.push('');
        }

        const setDigitAt = (index: number, nextDigit: string) => {
          const next = [...digits];
          next[index] = nextDigit;
          onChange(next.join(''));
        };

        const focusAt = (index: number) => {
          const clamped = Math.max(0, Math.min(length - 1, index));
          inputRefs.current[clamped]?.focus();
        };

        const handleChangeText = (index: number, text: string) => {
          const cleaned = onlyDigits(text);

          if (cleaned.length > 1) {
            const merged = [...digits];
            cleaned.split('').forEach((digit, offset) => {
              const target = index + offset;
              if (target < length) {
                merged[target] = digit;
              }
            });
            onChange(merged.join('').slice(0, length));
            focusAt(Math.min(index + cleaned.length, length - 1));
            return;
          }

          setDigitAt(index, cleaned.slice(-1));
          if (cleaned) {
            focusAt(index + 1);
          }
        };

        const handleKeyPress = (
          index: number,
          event: NativeSyntheticEvent<TextInputKeyPressEventData>,
        ) => {
          if (event.nativeEvent.key !== 'Backspace') {
            return;
          }
          if (digits[index]) {
            setDigitAt(index, '');
            return;
          }
          if (index > 0) {
            setDigitAt(index - 1, '');
            focusAt(index - 1);
          }
        };

        return (
          <View style={styles.container}>
            <InputLabel color={BrandColors.neutral.white}>{label}</InputLabel>
            <Separator size="xxs" />
            <View style={styles.row}>
              {digits.map((digit, index) => {
                const cellId = `otp-cell-${index + 1}`;
                return (
                  <View key={cellId} style={styles.cellShell}>
                    <GlassBackground blurPx={25} />
                    <TextInput
                      ref={(node) => {
                        inputRefs.current[index] = node;
                      }}
                      value={digit}
                      onChangeText={(text) => handleChangeText(index, text)}
                      onKeyPress={(event) => handleKeyPress(index, event)}
                      onBlur={onBlur}
                      placeholder={String(index + 1)}
                      placeholderTextColor={BrandColors.neutral.light}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      autoComplete="sms-otp"
                      maxLength={length}
                      selectTextOnFocus
                      style={styles.cellInput}
                    />
                  </View>
                );
              })}
            </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  cellShell: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: CELL_SIZE + Spacing.sm,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.white,
    overflow: 'hidden',
    ...glassShadow,
  },
  cellInput: {
    flex: 1,
    textAlign: 'center',
    color: BrandColors.neutral.white,
    fontSize: 16,
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
});
