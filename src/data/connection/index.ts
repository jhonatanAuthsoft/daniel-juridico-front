export type {
  ClientConnectionUiStatus,
  ConexaoListagemWire,
  ConexaoWire,
  ConnectionResult,
  ConnectionStatusCounts,
  ConnectionUrgencyCounts,
  CreateConnectionParams,
  ListConnectionsParams,
  ListConnectionsResult,
  StatusConexaoApi,
  UrgenciaConexaoApi,
} from './connection.types';

export {
  emptyConnectionStatusCounts,
  emptyConnectionUrgencyCounts,
  mapContagemPorStatus,
  mapContagemPorUrgencia,
  mapConexaoStatusToUi,
  mapConexaoWireToResult,
  normalizeConexaoListagemPayload,
} from './connection.mapper';

export {
  acceptConnection,
  cancelConnection,
  createConnection,
  getLawyerConnectionStatus,
  listConnections,
  listSolicitationConnections,
  markConnectionViewed,
  rejectConnection,
} from './connection.api';
