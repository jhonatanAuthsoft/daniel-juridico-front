import { Controller, useFormContext } from 'react-hook-form';
import { View } from 'react-native';

import {
  SelectableOption,
  SelectableOptionList,
} from '../selectable-option';
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
          );
        }}
      />
    </View>
  );
}
