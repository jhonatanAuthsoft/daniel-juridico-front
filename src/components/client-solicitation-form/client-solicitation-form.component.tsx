import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { FilterIcon } from '@/assets/icon/filter';
import { Button } from '@/atomic/button';
import { Form, InputSelectField, InputTextField, useForm } from '@/atomic/form';
import { Body2, Link } from '@/atomic/typography';
import { ClientFlowScreen } from '@/components/client-flow-screen';
import { ConnectionError } from '@/components/connection-error';
import { STATE_OPTIONS } from '@/constants/select-options';
import { BrandColors, Radius, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useCitiesByUf } from '@/domain/address';
import { useSpecialtiesCatalog } from '@/domain/catalog';
import { useCreateSolicitation } from '@/domain/solicitation';
import { useConnectivityGuard } from '@/hooks/use-connectivity-guard';

import {
  BILLING_OPTIONS,
  PRACTICE_OPTIONS,
  specialtyOptionsFromCategories,
  subspecialtyOptionsFromCategories,
  URGENCY_OPTIONS,
} from './client-solicitation-form.options';

const PROBLEM_MAX_LENGTH = 800;

type ClientSolicitationFormValues = {
  title: string;
  practice: string;
  specialty: string;
  state: string;
  city: string;
  urgency: string;
  problem: string;
  subspecialty: string;
  billingMethod: string;
  minimumExperienceMonths: string;
};

type ClientSolicitationFormProps = {
  onClose: () => void;
  onSubmitted: () => void;
};

const defaultValues: ClientSolicitationFormValues = {
  title: '',
  practice: '',
  specialty: '',
  state: '',
  city: '',
  urgency: '',
  problem: '',
  subspecialty: '',
  billingMethod: '',
  minimumExperienceMonths: '',
};

export function ClientSolicitationForm({
  onClose,
  onSubmitted,
}: ClientSolicitationFormProps) {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const form = useForm<ClientSolicitationFormValues>({
    defaultValues,
    mode: 'onChange',
  });
  const values = form.watch();
  const createSolicitation = useCreateSolicitation();

  const submitSolicitation = async () => {
    try {
      const result = await createSolicitation.mutateAsync({
        title: values.title,
        practice: values.practice,
        specialty: values.specialty,
        state: values.state,
        city: values.city,
        urgency: values.urgency,
        problem: values.problem,
        subspecialty: values.subspecialty,
        billingMethod: values.billingMethod,
        minimumExperienceMonths: values.minimumExperienceMonths,
      });

      Alert.alert(
        'Solicitação enviada',
        result.totalMatches > 0
          ? `Encontramos ${result.totalMatches} advogado(s) compatível(is).`
          : 'Sua solicitação foi criada. Ainda não há advogados compatíveis no momento.',
        [{ text: 'OK', onPress: onSubmitted }],
      );
    } catch (error) {
      Alert.alert(
        'Solicitação',
        getErrorMessage(error, 'Não foi possível criar a solicitação.'),
      );
    }
  };

  const { checkConnection, hasConnectionError, isCheckingConnection } =
    useConnectivityGuard(() => {
      void submitSolicitation();
    });
  const specialtiesCatalog = useSpecialtiesCatalog();
  const specialtyCategories = specialtiesCatalog.data?.categories ?? [];
  const specialtyOptions = specialtyOptionsFromCategories(specialtyCategories);
  const subspecialtyOptions = subspecialtyOptionsFromCategories(
    specialtyCategories,
    values.specialty || undefined,
  );

  const normalizedState = values.state.trim().toUpperCase();
  const { data: cityOptions = [], isFetching: isLoadingCities } =
    useCitiesByUf(normalizedState);
  const previousStateRef = useRef(normalizedState);
  const previousSpecialtyRef = useRef(values.specialty);

  useEffect(() => {
    if (previousStateRef.current === normalizedState) {
      return;
    }
    previousStateRef.current = normalizedState;
    form.setValue('city', '');
  }, [form, normalizedState]);

  useEffect(() => {
    if (previousSpecialtyRef.current === values.specialty) {
      return;
    }
    previousSpecialtyRef.current = values.specialty;
    form.setValue('subspecialty', '');
  }, [form, values.specialty]);

  const requiredValues = [
    values.title,
    values.practice,
    values.specialty,
    values.state,
    values.city,
    values.urgency,
    values.problem,
  ];
  const isFormValid = requiredValues.every((value) => value.trim().length > 0);
  const remainingCharacters = PROBLEM_MAX_LENGTH - values.problem.length;
  const isSubmitting = createSolicitation.isPending || isCheckingConnection;

  if (hasConnectionError) {
    return (
      <ClientFlowScreen
        title="Nova solicitação"
        onClose={onClose}
        scroll={false}
        contentContainerStyle={styles.offlineContent}>
        <ConnectionError
          isRetrying={isCheckingConnection}
          onRetry={() => void checkConnection()}
        />
      </ClientFlowScreen>
    );
  }

  return (
    <ClientFlowScreen
      title="Nova solicitação"
      onClose={onClose}
      keyboardAvoiding
      contentContainerStyle={styles.content}>
      <Form {...form}>
        <View style={styles.fields}>
          <InputTextField
            name="title"
            label="Título da demanda"
            placeholder="Digite o título da demanda"
            returnKeyType="next"
          />
          <InputSelectField
            name="practice"
            label="Atuação"
            placeholder="Selecione a atuação"
            options={PRACTICE_OPTIONS}
          />
          <InputSelectField
            name="specialty"
            label="Especialidade"
            placeholder="Selecione a especialidade"
            options={specialtyOptions}
          />
          <InputSelectField
            name="state"
            label="Estado"
            placeholder="Selecione o estado"
            options={STATE_OPTIONS}
          />
          <InputSelectField
            name="city"
            label="Cidade"
            placeholder={
              isLoadingCities ? 'Carregando cidades...' : 'Selecione a cidade'
            }
            options={cityOptions}
            disabled={!normalizedState || isLoadingCities}
          />
          <InputSelectField
            name="urgency"
            label="Grau de urgência"
            placeholder="Selecione o grau de urgência"
            options={URGENCY_OPTIONS}
          />

          <View>
            <InputTextField
              name="problem"
              label="Problema"
              placeholder="Descreva o problema..."
              multiline
              maxLength={PROBLEM_MAX_LENGTH}
              numberOfLines={5}
              textAlignVertical="top"
            />
            <Body2 color={BrandColors.neutral.light} style={styles.counter}>
              {remainingCharacters} caracteres restantes
            </Body2>
          </View>

          <Pressable
            accessibilityLabel="Filtros avançados"
            accessibilityRole="button"
            accessibilityState={{ expanded: advancedFiltersOpen }}
            onPress={() => setAdvancedFiltersOpen((open) => !open)}
            style={({ pressed }) => [
              styles.advancedToggle,
              pressed && styles.pressed,
            ]}>
            <FilterIcon
              testID="filter-icon"
              color={BrandColors.primary.light}
              width={16}
              height={18}
            />
            <Link color={BrandColors.primary.light}>Filtros avançados</Link>
            <SymbolView
              name={{
                ios: advancedFiltersOpen ? 'chevron.up' : 'chevron.down',
                android: advancedFiltersOpen
                  ? 'keyboard_arrow_up'
                  : 'keyboard_arrow_down',
                web: advancedFiltersOpen
                  ? 'keyboard_arrow_up'
                  : 'keyboard_arrow_down',
              }}
              size={18}
              tintColor={BrandColors.primary.light}
            />
          </Pressable>

          {advancedFiltersOpen ? (
            <View style={styles.advancedFields}>
              <InputSelectField
                name="subspecialty"
                label="Subespecialidade"
                placeholder="Selecione a subespecialidade"
                options={subspecialtyOptions}
              />
              <InputSelectField
                name="billingMethod"
                label="Formas de cobrança"
                placeholder="Selecione o método"
                options={BILLING_OPTIONS}
              />
              <InputTextField
                name="minimumExperienceMonths"
                label="Tempo mínimo de experiência (meses)"
                placeholder="Ex. 6"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
          ) : null}
        </View>
      </Form>

      <Button
        disabled={!isFormValid || isSubmitting}
        isLoading={isSubmitting}
        onPress={() => void checkConnection()}
        style={styles.submitButton}>
        Enviar solicitação
      </Button>
    </ClientFlowScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  offlineContent: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  fields: {
    gap: Spacing.sm,
  },
  counter: {
    marginTop: Spacing.xxxs,
  },
  advancedToggle: {
    minHeight: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    borderRadius: Radius.small,
  },
  advancedFields: {
    gap: Spacing.sm,
  },
  submitButton: {
    marginTop: Spacing.lg,
  },
  pressed: {
    opacity: 0.75,
  },
});
