import { useEffect } from 'react';
import { View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';

import { Button } from '@/atomic/button';
import { useBanner } from '@/atomic/feedback-banner';
import { Form, useForm } from '@/atomic/form';
import { Body1 } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import {
  SelectableOption,
  SelectableOptionList,
} from '@/components/signup-lawyer';
import { BrandColors, Spacing } from '@/constants/theme';
import { getErrorMessage } from '@/data/http';
import { useUpdateLawyerBilling } from '@/domain/lawyer';

import { BILLING_METHOD_OPTIONS } from './lawyer-edit-profile';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

type BillingForm = {
  billingMethods: string[];
};

export function LawyerEditBillingScreen() {
  const router = useRouter();
  const banner = useBanner();
  const { profile, fromMe } = useLawyerEditProfile();
  const updateBilling = useUpdateLawyerBilling();
  const form = useForm<BillingForm>({
    defaultValues: {
      billingMethods: profile.billingMethods,
    },
  });

  useEffect(() => {
    if (!fromMe) {
      return;
    }
    form.reset({
      billingMethods: fromMe.billingMethods,
    });
  }, [form, fromMe]);

  const onSubmit = form.handleSubmit(async (formValues) => {
    try {
      await updateBilling.mutateAsync({
        billingMethods: formValues.billingMethods,
      });
      router.back();
    } catch (error) {
      banner(
        getErrorMessage(error, 'Não foi possível salvar as alterações.'),
        'error',
      );
    }
  });

  return (
    <AccountStackScreen title="Alterar Métodos de Cobrança">
      <Body1 color={BrandColors.neutral.white}>
        Escolha suas especialidades para receber demandas compatíveis.
      </Body1>
      <Form {...form}>
        <Controller
          control={form.control}
          name="billingMethods"
          render={({ field: { value, onChange } }) => {
            const selected = value ?? [];

            const toggle = (id: string) => {
              if (selected.includes(id)) {
                onChange(selected.filter((item) => item !== id));
                return;
              }
              onChange([...selected, id]);
            };

            return (
              <View style={{ gap: Spacing.sm, width: '100%' }}>
                <SelectableOptionList>
                  {BILLING_METHOD_OPTIONS.map((option) => (
                    <SelectableOption
                      key={option.id}
                      checked={selected.includes(option.id)}
                      label={option.label}
                      onPress={() => toggle(option.id)}
                    />
                  ))}
                </SelectableOptionList>
              </View>
            );
          }}
        />
      </Form>
      <Button
        disabled={updateBilling.isPending}
        isLoading={updateBilling.isPending}
        onPress={() => void onSubmit()}
        variant="cta">
        Salvar alterações
      </Button>
    </AccountStackScreen>
  );
}
