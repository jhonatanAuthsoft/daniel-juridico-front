import { ClientAccountScreen } from '@/components/client-account';
import { DevelopmentGuard } from '@/components/development-guard';

export default function ClientPerfilScreen() {
  return (
    <DevelopmentGuard>
      <ClientAccountScreen />
    </DevelopmentGuard>
  );
}
