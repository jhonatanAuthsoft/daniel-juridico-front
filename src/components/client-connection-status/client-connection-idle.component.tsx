import { Button } from '@/atomic/button';

type ClientConnectionIdleProps = {
  onRequest: () => void;
  isLoading?: boolean;
};

export function ClientConnectionIdle({
  onRequest,
  isLoading = false,
}: ClientConnectionIdleProps) {
  return (
    <Button
      accessibilityLabel="Solicitar conexão"
      isLoading={isLoading}
      onPress={onRequest}
      variant="cta">
      Solicitar conexão
    </Button>
  );
}
