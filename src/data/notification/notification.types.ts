/** Wire / domain types for `/notificacoes`. */

export type TipoNotificacaoApi = 'CONEXAO_SOLICITADA' | 'CONEXAO_ACEITA';

export type ReferenciaNotificacaoApi = 'CONEXAO';

export type StatusEnvioNotificacaoApi =
  | 'PENDENTE'
  | 'ENVIADA'
  | 'SKIPPED'
  | 'ERROR';

export type NotificacaoWire = {
  id: string;
  titulo: string;
  texto: string;
  tipo: TipoNotificacaoApi;
  referenciaTipo: ReferenciaNotificacaoApi;
  referenciaId: string;
  remetenteId: string;
  criadoEm: string;
  lidaEm?: string | null;
  statusEnvio: StatusEnvioNotificacaoApi;
};

export type NaoLidasExisteWire = {
  existe: boolean;
};

export type ListNotificationsParams = {
  limit?: number;
  offset?: number;
};

export type NotificationResult = {
  id: string;
  title: string;
  body: string;
  type: TipoNotificacaoApi;
  referenceType: ReferenciaNotificacaoApi;
  referenceId: string;
  senderId: string;
  createdAt: string;
  readAt: string | null;
  isUnread: boolean;
  deliveryStatus: StatusEnvioNotificacaoApi;
};

export type UnreadExistsResult = {
  exists: boolean;
};
