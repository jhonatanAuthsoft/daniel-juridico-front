import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  useFieldArray,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { InputMultiSelectField, InputSelectField } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import {
  Body1,
  InputCaption,
  Link as TypographLink,
} from '@/atomic/typography';
import { STATE_OPTIONS, stateLabelFromValue } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { useCitiesByUf } from '@/domain/address';

import { signupLawyerSharedStyles } from '../shared.styles';
import type { LawyerSignupFormValues, ServiceAreaEntry } from '../types';

function normalizeCities(cities: string[]): string[] {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const city of cities) {
    const trimmed = city.trim();
    const key = trimmed.toLocaleLowerCase('pt-BR');
    if (!trimmed || seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(trimmed);
  }

  return normalized.sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

/** Collapses entries that share a state, keeping the first occurrence's position. */
function mergeByState(entries: ServiceAreaEntry[]): ServiceAreaEntry[] {
  const byState = new Map<string, ServiceAreaEntry>();

  for (const entry of entries) {
    const existing = byState.get(entry.state);
    if (existing) {
      existing.cities = normalizeCities([...existing.cities, ...entry.cities]);
      continue;
    }
    byState.set(entry.state, {
      state: entry.state,
      cities: normalizeCities(entry.cities),
    });
  }

  return [...byState.values()];
}

export function StepServiceRadius() {
  const { control, setValue } = useFormContext<LawyerSignupFormValues>();
  const { fields, remove, replace } = useFieldArray({
    control,
    name: 'serviceAreas',
    rules: {
      validate: (value) =>
        (value ?? []).length > 0
          ? true
          : 'Informe ao menos uma cidade de atuação',
    },
  });
  const { errors } = useFormState({ control, name: 'serviceAreas' });
  const serviceAreas = useWatch({ control, name: 'serviceAreas' }) ?? [];
  const draftState = useWatch({ control, name: 'serviceDraftState' }) ?? '';
  const draftCities = useWatch({ control, name: 'serviceDraftCities' }) ?? [];

  const normalizedState = draftState.trim().toUpperCase();
  const { data: cityOptions = [], isFetching } = useCitiesByUf(normalizedState);
  const previousStateRef = useRef(normalizedState);

  /** Index being edited; `null` means the editor creates a new state group. */
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (previousStateRef.current === normalizedState) {
      return;
    }
    previousStateRef.current = normalizedState;
    setValue('serviceDraftCities', []);
  }, [normalizedState, setValue]);

  const resetDraft = () => {
    previousStateRef.current = '';
    setValue('serviceDraftState', '');
    setValue('serviceDraftCities', []);
    setEditingIndex(null);
  };

  const saveDraft = () => {
    const cities = normalizeCities(draftCities);
    if (!normalizedState || cities.length === 0) {
      return;
    }

    const entries: ServiceAreaEntry[] = serviceAreas.map((area) => ({
      state: area.state,
      cities: area.cities ?? [],
    }));
    const draft: ServiceAreaEntry = { state: normalizedState, cities };

    if (editingIndex != null && editingIndex < entries.length) {
      entries[editingIndex] = draft;
    } else {
      entries.push(draft);
    }

    replace(mergeByState(entries));
    resetDraft();
  };

  const startEdit = (index: number) => {
    const entry = serviceAreas[index];
    if (!entry) {
      return;
    }
    // Keeps the state-change effect from clearing the cities we are loading.
    previousStateRef.current = entry.state;
    setValue('serviceDraftState', entry.state);
    setValue('serviceDraftCities', entry.cities ?? []);
    setEditingIndex(index);
  };

  const deleteAt = (index: number) => {
    remove(index);
    if (editingIndex == null) {
      return;
    }
    if (editingIndex === index) {
      resetDraft();
      return;
    }
    if (editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const canSave = Boolean(normalizedState) && normalizeCities(draftCities).length > 0;
  const errorMessage =
    errors.serviceAreas?.root?.message ?? errors.serviceAreas?.message;

  return (
    <View style={signupLawyerSharedStyles.fields}>
      <View style={styles.editorCard}>
        <InputSelectField
          name="serviceDraftState"
          label="Estado"
          placeholder="Selecione o estado"
          options={STATE_OPTIONS}
        />
        <InputMultiSelectField
          name="serviceDraftCities"
          label="Cidade"
          placeholder={
            isFetching ? 'Carregando cidades...' : 'Selecione a cidade'
          }
          options={cityOptions}
          disabled={!normalizedState || isFetching}
        />

        <Button variant="primary" disabled={!canSave} onPress={saveDraft}>
          Salvar
        </Button>

        {editingIndex != null ? (
          <Pressable
            accessibilityRole="button"
            onPress={resetDraft}
            style={styles.cancelLink}>
            <TypographLink color={BrandColors.primary.light}>
              Cancelar edição
            </TypographLink>
          </Pressable>
        ) : null}
      </View>

      {fields.map((field, index) => {
        const entry = serviceAreas[index] ?? field;
        const stateLabel = stateLabelFromValue(entry.state);
        const cities = entry.cities ?? [];

        return (
          <View key={field.id} style={styles.savedCard}>
            <View style={styles.savedHeader}>
              <Body1 bold color={BrandColors.neutral.white} style={styles.savedTitle}>
                {stateLabel}
              </Body1>
              <View style={styles.savedActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar cidades de ${stateLabel}`}
                  hitSlop={Spacing.xxs}
                  onPress={() => startEdit(index)}>
                  <SymbolView
                    name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                    size={20}
                    tintColor={BrandColors.neutral.white}
                  />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Excluir ${stateLabel}`}
                  hitSlop={Spacing.xxs}
                  onPress={() => deleteAt(index)}>
                  <SymbolView
                    name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                    size={20}
                    tintColor={BrandColors.primary.light}
                  />
                </Pressable>
              </View>
            </View>

            <Separator size="xxs" />

            <Body1 color={BrandColors.primary.light}>{cities.join('; ')}</Body1>
          </View>
        );
      })}

      {errorMessage ? (
        <View style={styles.errorRow}>
          <XIcon color={BrandColors.feedback.error.medium} />
          <InputCaption color={BrandColors.feedback.error.light}>
            {errorMessage}
          </InputCaption>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  editorCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.dark,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  cancelLink: {
    alignSelf: 'center',
  },
  savedCard: {
    width: '100%',
    borderRadius: Radius.large,
    borderWidth: 1,
    borderColor: BrandColors.neutral.dark,
    backgroundColor: BrandColors.neutral.xdark,
    padding: Spacing.sm,
  },
  savedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  savedTitle: {
    flex: 1,
  },
  savedActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxxs,
  },
});
