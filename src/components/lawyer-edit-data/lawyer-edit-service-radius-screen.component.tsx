import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputMultiSelectField, InputSelectField, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import {
  UnsavedDraftProvider,
  useRegisterUnsavedDraft,
  useUnsavedDraftLeave,
} from '@/components/unsaved-draft-guard';
import { validateServiceAreas } from '@/components/signup-lawyer/step-service-radius/step-service-radius.component';
import { OptionCheckbox } from '@/components/signup-lawyer/selectable-option';
import type { ServiceAreaEntry } from '@/components/signup-lawyer/types';
import {
  resolveUfFromStateValue,
  STATE_OPTIONS,
  stateLabelFromValue,
} from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useCitiesByUf } from '@/domain/address';
import { useUpdateLawyerServiceAreas } from '@/domain/lawyer';

import {
  addCitiesToServiceAreas,
  formatServiceAreaSummary,
  normalizeCities,
  replaceServiceAreaCities,
  setEntireStateServiceArea,
} from './service-area';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type DraftForm = {
  draftState: string;
  draftCities: string[];
  draftEntireState: boolean;
};

export function LawyerEditServiceRadiusScreen() {
  return (
    <UnsavedDraftProvider>
      <LawyerEditServiceRadiusContent />
    </UnsavedDraftProvider>
  );
}

function LawyerEditServiceRadiusContent() {
  const router = useRouter();
  const banner = useBanner();
  const requestLeave = useUnsavedDraftLeave();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateServiceAreas = useUpdateLawyerServiceAreas();
  const [areas, setAreas] = useState<ServiceAreaEntry[]>(profile.serviceAreas);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<DraftForm>({
    defaultValues: {
      draftState: '',
      draftCities: [],
      draftEntireState: false,
    },
  });

  const draftState = form.watch('draftState');
  const draftCities = form.watch('draftCities') ?? [];
  const draftEntireState = form.watch('draftEntireState');
  const normalizedState = resolveUfFromStateValue(draftState);
  const hasValidState = normalizedState.length === 2;
  const previousStateRef = useRef(normalizedState);
  const {
    data: cityOptions = [],
    isFetching,
    isError: isCitiesError,
  } = useCitiesByUf(draftEntireState ? '' : normalizedState);

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    setAreas(fromMe.serviceAreas);
  }, [fromMe]);

  useEffect(() => {
    const resolved = resolveUfFromStateValue(draftState);
    if (!resolved || resolved === draftState.trim()) {
      return;
    }
    previousStateRef.current = resolved;
    form.setValue('draftState', resolved);
  }, [draftState, form]);

  const resetDraft = () => {
    previousStateRef.current = '';
    form.setValue('draftState', '');
    form.setValue('draftCities', []);
    form.setValue('draftEntireState', false);
    setEditingIndex(null);
  };

  const addEntireState = (state: string) => {
    setAreas((current) => setEntireStateServiceArea(current, state));
    setErrorMessage(null);
    resetDraft();
  };

  useEffect(() => {
    if (previousStateRef.current === normalizedState) {
      return;
    }
    previousStateRef.current = normalizedState;
    form.setValue('draftCities', []);
  }, [form, normalizedState]);

  useRegisterUnsavedDraft({
    itemLabel: 'cidade de atuação',
    hasUnsavedDraft: () =>
      resolveUfFromStateValue(form.getValues('draftState')).length === 2 ||
      normalizeCities(form.getValues('draftCities') ?? []).length > 0 ||
      Boolean(form.getValues('draftEntireState')),
    discardUnsavedDraft: () => {
      resetDraft();
    },
  });

  const addDraft = () => {
    if (!hasValidState) {
      return;
    }
    if (draftEntireState) {
      addEntireState(normalizedState);
      return;
    }

    const cities = normalizeCities(draftCities);
    if (cities.length === 0) {
      return;
    }

    setAreas((current) =>
      editingIndex != null && editingIndex < current.length
        ? replaceServiceAreaCities(current, normalizedState, cities)
        : addCitiesToServiceAreas(current, normalizedState, cities),
    );
    setErrorMessage(null);
    resetDraft();
  };

  const toggleEntireState = () => {
    const next = !draftEntireState;
    form.setValue('draftEntireState', next);
    if (next) {
      form.setValue('draftCities', []);
    }
  };

  const startEdit = (index: number) => {
    const entry = areas[index];
    if (!entry) {
      return;
    }
    previousStateRef.current = entry.state;
    form.setValue('draftState', entry.state);
    form.setValue('draftEntireState', Boolean(entry.entireState));
    form.setValue('draftCities', entry.entireState ? [] : (entry.cities ?? []));
    setEditingIndex(index);
  };

  const deleteAt = (index: number) => {
    setAreas((current) => current.filter((_, areaIndex) => areaIndex !== index));
    setErrorMessage(null);
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

  const saveChanges = async () => {
    const cities = normalizeCities(draftCities);
    const nextAreas = hasValidState && draftEntireState
      ? setEntireStateServiceArea(areas, normalizedState)
      : hasValidState && cities.length > 0
        ? editingIndex != null
          ? replaceServiceAreaCities(areas, normalizedState, cities)
          : addCitiesToServiceAreas(areas, normalizedState, cities)
        : areas;

    const validation = validateServiceAreas(
      nextAreas,
      hasValidState && cities.length === 0 && !draftEntireState ? normalizedState : '',
      cities,
      hasValidState && draftEntireState,
    );
    if (validation !== true) {
      setErrorMessage(validation);
      return;
    }

    try {
      await updateServiceAreas.mutateAsync({ serviceAreas: nextAreas });
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
        'error',
      );
    }
  };

  const canAdd =
    hasValidState &&
    (draftEntireState || normalizeCities(draftCities).length > 0);

  return (
    <AccountStackScreen
      onBack={() => requestLeave(() => router.back())}
      title="Raio de atuação">
      <Form {...form}>
        <View style={[styles.editorCard, errorMessage ? styles.editorCardError : null]}>
          <InputSelectField
            name="draftState"
            label="Estado"
            placeholder="Selecione o estado"
            options={STATE_OPTIONS}
          />
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: draftEntireState }}
            hitSlop={Spacing.xxs}
            onPress={toggleEntireState}
            style={styles.checkboxRow}>
            <OptionCheckbox checked={draftEntireState} />
            <InputCaption
              color={
                draftEntireState
                  ? BrandColors.primary.light
                  : BrandColors.neutral.light
              }>
              Atuo em todo o estado
            </InputCaption>
          </Pressable>
          {draftEntireState ? null : (
            <InputMultiSelectField
              name="draftCities"
              label="Cidade"
              labelLoading={isFetching}
              placeholder={
                !hasValidState
                  ? 'Selecione o estado primeiro'
                  : isFetching
                    ? 'Carregando cidades...'
                    : isCitiesError
                      ? 'Não foi possível carregar as cidades'
                      : 'Selecione a cidade'
              }
              options={cityOptions}
              optionsLoading={isFetching}
              disabled={!hasValidState}
            />
          )}
          <View style={styles.addRow}>
            <Button
              disabled={!canAdd}
              onPress={addDraft}
              variant="link">
              Adicionar
            </Button>
          </View>
        </View>
      </Form>

      {areas.map((entry, index) => {
        const stateLabel = stateLabelFromValue(entry.state);

        return (
          <View key={`${entry.state}-${index}`} style={styles.savedCard}>
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
            <Body1 color={BrandColors.neutral.white}>
              {formatServiceAreaSummary(entry)}
            </Body1>
          </View>
        );
      })}

      {errorMessage ? (
        <View style={styles.errorRow}>
          <XIcon color={BrandColors.feedback.error.medium} />
          <InputCaption color={BrandColors.feedback.error.light}>{errorMessage}</InputCaption>
        </View>
      ) : null}

      <Button
        disabled={updateServiceAreas.isPending}
        isLoading={updateServiceAreas.isPending}
        onPress={() => void saveChanges()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
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
  editorCardError: {
    borderWidth: 1.8,
    borderColor: BrandColors.feedback.error.medium,
  },
  addRow: {
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
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
