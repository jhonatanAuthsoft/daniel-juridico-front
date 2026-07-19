import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { ClientSolicitationForm } from '@/components/client-solicitation-form';

export default function NewSolicitationScreen() {
  const router = useRouter();
  const returnToSolicitations = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ClientSolicitationForm
      onClose={returnToSolicitations}
      onSubmitted={returnToSolicitations}
    />
  );
}
