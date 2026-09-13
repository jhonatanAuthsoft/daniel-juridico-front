import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, InputSelectField, useForm } from '@/atomic/form';
import { Separator } from '@/atomic/separator';
import { Body1, InputCaption } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import {
  UnsavedDraftProvider,
  useRegisterUnsavedDraft,
  useUnsavedDraftLeave,
} from '@/components/unsaved-draft-guard';
import { validateServiceAreas } from '@/components/signup-lawyer/step-service-radius/step-service-radius.component';
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
  addCityToServiceAreas,
  formatServiceAreaCities,
} from './service-area';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type DraftForm = {
  draftState: string;
  draftCity: string;
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<DraftForm>({
    defaultValues: {
      draftState: '',
      draftCity: '',
    },
  });

  const draftState = form.watch('draftState');
  const draftCity = form.watch('draftCity');
  const normalizedState = resolveUfFromStateValue(draftState);
  const hasValidState = normalizedState.length === 2;
  const previousStateRef = useRef(normalizedState);
  const {
    data: cityOptions = [],
    isFetching,
    isError: isCitiesError,
  } = useCitiesByUf(normalizedState);

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

  useEffect(() => {
    if (previousStateRef.current === normalizedState) {
      return;
    }
    previousStateRef.current = normalizedState;
    form.setValue('draftCity', '');
  }, [form, normalizedState]);

  const resetDraft = () => {
    previousStateRef.current = '';
    form.setValue('draftState', '');
    form.setValue('draftCity', '');
  };

  useRegisterUnsavedDraft({
    itemLabel: 'cidade de atuação',
    hasUnsavedDraft: () =>
      resolveUfFromStateValue(form.getValues('draftState')).length === 2 ||
      form.getValues('draftCity').trim().length > 0,
    discardUnsavedDraft: () => {
      resetDraft();
    },
  });

  const addCity = () => {
    const city = draftCity.trim();
    if (!hasValidState || !city) {
      return;
    }

    setAreas((current) => addCityToServiceAreas(current, normalizedState, city));
    setErrorMessage(null);
    resetDraft();
  };

  const startEdit = (index: number) => {
    const entry = areas[index];
    if (!entry) {
      return;
    }
    previousStateRef.current = entry.state;
    form.setValue('draftState', entry.state);
    form.setValue('draftCity', '');
  };

  const deleteAt = (index: number) => {
    setAreas((current) => current.filter((_, areaIndex) => areaIndex !== index));
    setErrorMessage(null);
  };

  const saveChanges = async () => {
    const city = draftCity.trim();
    const nextAreas =
      hasValidState && city
        ? addCityToServiceAreas(areas, normalizedState, city)
        : areas;

    const validation = validateServiceAreas(
      nextAreas,
      hasValidState && !city ? normalizedState : '',
      city ? [city] : [],
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
          <InputSelectField
            name="draftCity"
            label="Cidade"
            labelLoading={isFetching}
            placeholder={
              isFetching
                ? 'Carregando cidades...'
                : isCitiesError
                  ? 'Não foi possível carregar as cidades'
                  : 'Selecione a cidade'
            }
            options={cityOptions}
            optionsLoading={isFetching}
            disabled={!hasValidState}
          />
          <View style={styles.addRow}>
            <Button
              disabled={!hasValidState || draftCity.trim().length === 0}
              onPress={addCity}
              variant="link">
              + Adicionar nova cidade
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
              {formatServiceAreaCities(entry.cities)}
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
