import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Link } from '@/atomic/typography';
import { AccountStackScreen } from '@/components/client-edit-data';
import { EditDataNavCard } from '@/components/client-edit-data/edit-data-nav-card.component';
import { formatPracticeAreasSummary } from '@/components/signup-lawyer/practice-areas.data';
import { BrandColors, Spacing } from '@/constants/theme';

import {
  formatBillingSummary,
  formatLawyerAddressSummary,
  formatOabHubLabel,
  formatSpecialtiesSummary,
  formatTreatmentPronounChip,
} from './lawyer-edit-profile';
import { formatServiceAreaHubSummary } from './service-area';
import { useLawyerEditProfile } from './use-lawyer-edit-profile';

export function LawyerEditDataHubScreen() {
  const router = useRouter();
  const { profile, fromMe } = useLawyerEditProfile();
  const name = profile.fullName || 'Advogada';
  const pronounChip = fromMe ? formatTreatmentPronounChip(profile.pronouns) : '';
  const serviceAreaSummary = fromMe
    ? formatServiceAreaHubSummary(fromMe.serviceAreas)
    : '';

  return (
    <AccountStackScreen title="Editar Dados Básicos">
      <EditDataNavCard
        accessibilityLabel="Editar nome e email"
        onPress={() => router.push('/lawyer/perfil/nome-email')}
        subtitle={profile.email}
        title={name}
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar endereço"
        onPress={() => router.push('/lawyer/perfil/endereco')}
        subtitle={fromMe ? formatLawyerAddressSummary(profile) : ''}
        title="Endereço"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar raio de atuação"
        onPress={() => router.push('/lawyer/perfil/raio-atuacao')}
        subtitle={serviceAreaSummary}
        title="Raio de atuação"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar atuação"
        onPress={() => router.push('/lawyer/perfil/atuacao')}
        subtitle={fromMe ? formatPracticeAreasSummary(profile.practiceAreas) : ''}
        title="Atuação"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar especialização"
        onPress={() => router.push('/lawyer/perfil/especializacao')}
        subtitle={fromMe ? formatSpecialtiesSummary(profile.specialtyLabels) : ''}
        title="Especialização"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar métodos de cobrança"
        onPress={() => router.push('/lawyer/perfil/metodos-cobranca')}
        subtitle={fromMe ? formatBillingSummary(profile.billingMethods) : ''}
        title="Método de cobrança"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar biografia e pronome"
        badge={pronounChip || undefined}
        onPress={() => router.push('/lawyer/perfil/biografia')}
        subtitle={fromMe ? profile.biography : ''}
        subtitleNumberOfLines={3}
        title="Biografia"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar documentação"
        onPress={() => router.push('/lawyer/perfil/documentacao')}
        subtitle={fromMe ? formatOabHubLabel(profile.oabNumber, profile.oabUf) : ''}
        title="Documentação"
        titleBold
      />
      <EditDataNavCard
        accessibilityLabel="Editar formação"
        onPress={() => router.push('/lawyer/perfil/graduacao')}
        subtitle={fromMe ? profile.university : ''}
        title="Formação"
        titleBold
      />

      <Pressable
        accessibilityLabel="Apagar conta"
        accessibilityRole="button"
        onPress={() => router.push('/lawyer/perfil/apagar-conta')}
        style={({ pressed }) => [styles.deleteRow, pressed && styles.pressed]}>
        <SymbolView
          name={{ ios: 'trash', android: 'delete', web: 'delete' }}
          size={20}
          tintColor={BrandColors.feedback.error.medium}
        />
        <Link color={BrandColors.feedback.error.medium}>Apagar conta</Link>
      </Pressable>
    </AccountStackScreen>
  );
}

const styles = StyleSheet.create({
  deleteRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxs,
  },
  pressed: {
    opacity: 0.75,
  },
});
