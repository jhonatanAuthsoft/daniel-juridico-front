import { useRouter } from 'expo-router';

import { AccountStackScreen } from './account-stack-screen.component';
import { EditDataNavCard } from './edit-data-nav-card.component';
import {
  formatAddressSummary,
  formatPersonalSummary,
} from './client-edit-profile-summary';
import { useClientEditProfile } from './use-client-edit-profile';

export function ClientEditDataHubScreen() {
  const router = useRouter();
  const { profile, fromMe } = useClientEditProfile();
  const name = profile.fullName || 'Cliente';
  const email = profile.email;

  return (
    <AccountStackScreen title="Editar Dados Básicos">
      <EditDataNavCard
        accessibilityLabel="Editar dados gerais"
        onPress={() => router.push('/client/perfil/dados-gerais')}
        subtitle={email}
        title={name}
      />
      <EditDataNavCard
        accessibilityLabel="Editar endereço"
        onPress={() => router.push('/client/perfil/endereco')}
        subtitle={fromMe ? formatAddressSummary(profile) : ''}
        title="Endereço"
      />
      <EditDataNavCard
        accessibilityLabel="Editar perfil pessoal"
        onPress={() => router.push('/client/perfil/perfil-pessoal')}
        subtitle={fromMe ? formatPersonalSummary(profile) : ''}
        title="Perfil Pessoal"
      />
    </AccountStackScreen>
  );
}
