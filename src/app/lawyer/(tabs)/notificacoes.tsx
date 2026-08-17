import { LawyerNotificationsInbox } from '@/components/lawyer-notifications';
import { DevelopmentGuard } from '@/components/development-guard';

export default function LawyerNotificacoesScreen() {
  return (
    <DevelopmentGuard>
      <LawyerNotificationsInbox />
    </DevelopmentGuard>
  );
}
