export type {
  ClientConnectionUiStatus,
  ConexaoWire,
  ConnectionResult,
  CreateConnectionParams,
  ListConnectionsParams,
  StatusConexaoApi,
} from './connection.types';

export {
  mapConexaoStatusToUi,
  mapConexaoWireToResult,
} from './connection.mapper';

export {
  acceptConnection,
  cancelConnection,
  createConnection,
  getLawyerConnectionStatus,
  listConnections,
  listSolicitationConnections,
  rejectConnection,
} from './connection.api';
