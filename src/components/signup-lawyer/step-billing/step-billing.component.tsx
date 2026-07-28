import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import { Separator } from '@/atomic/separator';
import { InputCaption } from '@/atomic/typography';
import { BrandColors } from '@/constants/theme';

import {
  SelectableOption,
  SelectableOptionList,
} from '../selectable-option';
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
        rules={{
          validate: (value) =>
            (value?.length ?? 0) > 0 ? true : 'Selecione ao menos uma opção',
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selected = value ?? [];

          const toggle = (id: string) => {
            if (selected.includes(id)) {
              onChange(selected.filter((item) => item !== id));
              return;
            }
            onChange([...selected, id]);
          };

          return (
            <View>
              <SelectableOptionList>
                {BILLING_OPTIONS.map((option) => (
                  <SelectableOption
                    key={option.id}
                    checked={selected.includes(option.id)}
                    label={option.label}
                    onPress={() => toggle(option.id)}
                  />
                ))}
              </SelectableOptionList>
              {error?.message ? (
                <>
                  <Separator size="xxxs" />
                  <InputCaption color={BrandColors.feedback.error.light}>
                    {error.message}
                  </InputCaption>
                </>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}
