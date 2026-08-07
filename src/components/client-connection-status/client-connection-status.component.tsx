import { ClientConnectionAccepted } from './client-connection-accepted.component';
import { ClientConnectionIdle } from './client-connection-idle.component';
import { ClientConnectionPending } from './client-connection-pending.component';
import { ClientConnectionRejected } from './client-connection-rejected.component';

export type ClientConnectionStatusValue =
  | 'idle'
  | 'pending'
  | 'accepted'
  | 'rejected';

type ClientConnectionStatusProps = {
  status: ClientConnectionStatusValue;
  phone: string;
  email: string;
  onRequest: () => void;
  onCancel: () => void;
  isRequesting?: boolean;
  isCancelling?: boolean;
};

export function ClientConnectionStatus({
  status,
  phone,
  email,
  onRequest,
  onCancel,
  isRequesting = false,
  isCancelling = false,
}: ClientConnectionStatusProps) {
  switch (status) {
    case 'idle':
      return (
        <ClientConnectionIdle isLoading={isRequesting} onRequest={onRequest} />
      );
    case 'pending':
      return (
        <ClientConnectionPending
          isCancelling={isCancelling}
          onCancel={onCancel}
        />
      );
    case 'accepted':
      return <ClientConnectionAccepted email={email} phone={phone} />;
    case 'rejected':
      return <ClientConnectionRejected />;
  }
}
