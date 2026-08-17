import { ClientNotificationsInbox } from '@/components/client-notifications';
import { DevelopmentGuard } from '@/components/development-guard';

export default function ClientNotificacoesScreen() {
  return (
    <DevelopmentGuard>
      <ClientNotificationsInbox />
    </DevelopmentGuard>
  );
}
