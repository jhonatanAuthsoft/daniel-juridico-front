import { LawyerAccountScreen } from '@/components/lawyer-account';
import { DevelopmentGuard } from '@/components/development-guard';

export default function LawyerPerfilScreen() {
  return (
    <DevelopmentGuard>
      <LawyerAccountScreen />
    </DevelopmentGuard>
  );
}
