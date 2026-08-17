import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CaretLeftIcon } from '@/assets/icon/caret-left';
import { FilterIcon } from '@/assets/icon/filter';
import { Button } from '@/atomic/button';
import { Form, InputSelectField, InputTextField, useForm, useWatch } from '@/atomic/form';
import { Body2, Link } from '@/atomic/typography';
import { ClientFlowScreen } from '@/components/client-flow-screen';
import { ConnectionError } from '@/components/connection-error';
import {
  CLIENT_EMERGENCY_ATTENTION_MESSAGE,
  EmergencyAttentionBanner,
} from '@/components/emergency-attention-banner';
import { resolveUfFromStateValue, STATE_OPTIONS } from '@/constants/select-options';
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
import { PracticeHelpModal } from './practice-help-modal.component';

const PROBLEM_MAX_LENGTH = 800;
const ANIMATION_DURATION_MS = 260;
const ANIMATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
const TIMING = {
  duration: ANIMATION_DURATION_MS,
  easing: ANIMATION_EASING,
} as const;

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

type AdvancedFiltersSectionProps = {
  open: boolean;
  onToggle: () => void;
  subspecialtyOptions: ReturnType<typeof subspecialtyOptionsFromCategories>;
};

function AdvancedFiltersSection({
  open,
  onToggle,
  subspecialtyOptions,
}: AdvancedFiltersSectionProps) {
  const progress = useSharedValue(open ? 1 : 0);
  const height = useSharedValue(0);
  const measuredHeight = useSharedValue(0);
  const wasOpen = useRef(open);

  useEffect(() => {
    if (wasOpen.current === open) {
      return;
    }
    wasOpen.current = open;
    progress.value = withTiming(open ? 1 : 0, TIMING);
    height.value = withTiming(open ? measuredHeight.value : 0, TIMING);
  }, [height, measuredHeight, open, progress]);

  const bodyStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(progress.value, [0, 0.2, 1], [0, 0.7, 1]),
    overflow: 'hidden' as const,
  }));

  const caretStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const fields = (
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
        searchable={false}
      />
      <InputTextField
        name="minimumExperienceMonths"
        label="Tempo mínimo de experiência (meses)"
        placeholder="Ex. 6"
        keyboardType="number-pad"
        maxLength={3}
      />
    </View>
  );

  return (
    <View>
      <Pressable
        accessibilityLabel="Filtros avançados"
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={onToggle}
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
        <Animated.View style={caretStyle}>
          <CaretLeftIcon
            color={BrandColors.primary.light}
            direction="down"
            height={18}
            width={18}
          />
        </Animated.View>
      </Pressable>

      <View style={styles.advancedBodySlot}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={styles.advancedMeasure}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight <= 0) {
              return;
            }
            const previous = measuredHeight.value;
            measuredHeight.value = nextHeight;
            if (open && (previous <= 0 || Math.abs(previous - nextHeight) > 1)) {
              height.value = nextHeight;
            }
          }}>
          {fields}
        </View>
        <Animated.View
          accessibilityElementsHidden={!open}
          importantForAccessibility={open ? 'yes' : 'no-hide-descendants'}
          pointerEvents={open ? 'auto' : 'none'}
          style={bodyStyle}>
          {fields}
        </Animated.View>
      </View>
    </View>
  );
}

export function ClientSolicitationForm({
  onClose,
  onSubmitted,
}: ClientSolicitationFormProps) {
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [practiceHelpVisible, setPracticeHelpVisible] = useState(false);
  const form = useForm<ClientSolicitationFormValues>({
    defaultValues,
    mode: 'onChange',
  });
  const values = form.watch();
  const stateValue = useWatch({ control: form.control, name: 'state' }) ?? '';
  const normalizedState = resolveUfFromStateValue(stateValue);
  const hasValidState = normalizedState.length === 2;
  const createSolicitation = useCreateSolicitation();

  useEffect(() => {
    const resolved = resolveUfFromStateValue(stateValue);
    if (!resolved || resolved === stateValue) {
      return;
    }
    form.setValue('state', resolved, { shouldDirty: true, shouldValidate: true });
  }, [form, stateValue]);

  const submitSolicitation = async () => {
    try {
      await createSolicitation.mutateAsync({
        title: values.title,
        practice: values.practice,
        specialty: values.specialty,
        state: normalizedState || values.state,
        city: values.city,
        urgency: values.urgency,
        problem: values.problem,
        subspecialty: values.subspecialty,
        billingMethod: values.billingMethod,
        minimumExperienceMonths: values.minimumExperienceMonths,
      });

      onSubmitted();
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

  const {
    data: cityOptions = [],
    isFetching: isLoadingCities,
    isError: isCitiesError,
  } = useCitiesByUf(normalizedState);
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
            searchable={false}
            onHelpPress={() => setPracticeHelpVisible(true)}
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
              !hasValidState
                ? 'Selecione o estado primeiro'
                : isLoadingCities
                  ? 'Carregando cidades...'
                  : isCitiesError
                    ? 'Não foi possível carregar as cidades'
                    : 'Selecione a cidade'
            }
            options={cityOptions}
            optionsLoading={isLoadingCities}
            disabled={!hasValidState}
          />
          <InputSelectField
            name="urgency"
            label="Grau de urgência"
            placeholder="Selecione o grau de urgência"
            options={URGENCY_OPTIONS}
            searchable={false}
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

          <AdvancedFiltersSection
            onToggle={() => setAdvancedFiltersOpen((current) => !current)}
            open={advancedFiltersOpen}
            subspecialtyOptions={subspecialtyOptions}
          />

          <EmergencyAttentionBanner
            message={CLIENT_EMERGENCY_ATTENTION_MESSAGE}
            visible={values.urgency === 'imediata'}
          />
        </View>
      </Form>

      <Button
        disabled={!isFormValid || isSubmitting}
        isLoading={isSubmitting}
        onPress={() => void checkConnection()}
        style={styles.submitButton}>
        Enviar solicitação
      </Button>
      <PracticeHelpModal
        onClose={() => setPracticeHelpVisible(false)}
        visible={practiceHelpVisible}
      />
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
  advancedBodySlot: {
    position: 'relative',
  },
  advancedMeasure: {
    position: 'absolute',
    left: 0,
    right: 0,
    opacity: 0,
    zIndex: -1,
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
