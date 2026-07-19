import { Button } from '@/atomic/button';

type ClientConnectionIdleProps = {
  onRequest: () => void;
};

export function ClientConnectionIdle({
  onRequest,
}: ClientConnectionIdleProps) {
  return (
    <Button
      accessibilityLabel="Solicitar conexão"
      onPress={onRequest}
      variant="cta">
      Solicitar conexão
    </Button>
  );
}
