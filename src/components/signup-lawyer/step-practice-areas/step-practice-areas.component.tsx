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
import { PRACTICE_AREA_NONE_ID } from '../signup-step-navigation';
import type { LawyerSignupFormValues } from '../types';

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
    id: PRACTICE_AREA_NONE_ID,
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
        rules={{
          validate: (value) =>
            (value?.length ?? 0) > 0 ? true : 'Selecione ao menos uma opção',
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selected = value ?? [];

          const toggle = (id: string) => {
            const isSelected = selected.includes(id);

            if (id === PRACTICE_AREA_NONE_ID) {
              onChange(isSelected ? [] : [PRACTICE_AREA_NONE_ID]);
              return;
            }

            const withoutNone = selected.filter(
              (item) => item !== PRACTICE_AREA_NONE_ID,
            );
            if (isSelected) {
              onChange(withoutNone.filter((item) => item !== id));
              return;
            }
            onChange([...withoutNone, id]);
          };

          return (
            <View>
              <SelectableOptionList>
                {PRACTICE_OPTIONS.map((option) => (
                  <SelectableOption
                    key={option.id}
                    checked={selected.includes(option.id)}
                    label={option.label}
                    description={
                      'description' in option ? option.description : undefined
                    }
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
