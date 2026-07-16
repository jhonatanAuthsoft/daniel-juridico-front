import { SymbolView } from 'expo-symbols';

import { InputTextField } from '@/atomic/form';
import { BrandColors } from '@/constants/theme';

import type { LawyerSignupFormValues } from '../types';

export type SelectFieldShellProps = {
  name: keyof LawyerSignupFormValues;
  label?: string;
  placeholder: string;
};

function ChevronDownIcon() {
  return (
    <SymbolView
      name={{ ios: 'chevron.down', android: 'arrow_drop_down', web: 'keyboard_arrow_down' }}
      size={20}
      tintColor={BrandColors.neutral.light}
    />
  );
}

export function SelectFieldShell({ name, label, placeholder }: SelectFieldShellProps) {
  return (
    <InputTextField
      name={name}
      label={label}
      placeholder={placeholder}
      editable={false}
      pointerEvents="none"
      iconRight={<ChevronDownIcon />}
    />
  );
}
