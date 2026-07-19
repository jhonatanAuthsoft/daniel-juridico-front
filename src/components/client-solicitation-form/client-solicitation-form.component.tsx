import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterIcon } from '@/assets/icon/filter';
import { XIcon } from '@/assets/icon/x';
import { Button } from '@/atomic/button';
import { Form, InputSelectField, InputTextField, useForm } from '@/atomic/form';
import { Body2, Display, Link } from '@/atomic/typography';
import { ConnectionError } from '@/components/connection-error';
import { CITIES_BY_UF, STATE_OPTIONS } from '@/constants/select-options';
import {
  BrandColors,
  MaxContentWidth,
  Radius,
  Spacing,
} from '@/constants/theme';
import { useConnectivityGuard } from '@/hooks/use-connectivity-guard';

import {
  BILLING_OPTIONS,
  PRACTICE_OPTIONS,
  SPECIALTY_OPTIONS,
  SUBSPECIALTY_OPTIONS,
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
  const { checkConnection, hasConnectionError, isCheckingConnection } =
    useConnectivityGuard(onSubmitted);

  const cityOptions = CITIES_BY_UF[values.state] ?? [];
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

  if (hasConnectionError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        <ConnectionError
          isRetrying={isCheckingConnection}
          onRetry={() => void checkConnection()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Display color={BrandColors.neutral.white}>Nova solicitação</Display>
            <Pressable
              accessibilityLabel="Fechar"
              accessibilityRole="button"
              hitSlop={Spacing.xxs}
              onPress={onClose}
              style={({ pressed }) => pressed && styles.pressed}>
              <XIcon color={BrandColors.neutral.white} width={22} height={22} />
            </Pressable>
          </View>

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
                options={SPECIALTY_OPTIONS}
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
                placeholder="Selecione a cidade"
                options={cityOptions}
                disabled={!values.state}
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
                    android: advancedFiltersOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down',
                    web: advancedFiltersOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down',
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
                    options={SUBSPECIALTY_OPTIONS}
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
            disabled={!isFormValid}
            isLoading={isCheckingConnection}
            onPress={() => void checkConnection()}
            style={styles.submitButton}>
            Enviar solicitação
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.neutral.xdark,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
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
