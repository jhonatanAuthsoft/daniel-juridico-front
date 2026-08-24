/** Wire / domain types for `GET /usuarios/me`. */

export type MePerfilWire = {
  fotoUrl?: string | null;
};

export type MeDetalheWire = {
  perfil?: MePerfilWire | null;
};

export type MeWireResponse = {
  usuario: {
    id: string;
    email: string;
    nomeCompleto: string;
    perfil: string;
    notificacoesPushHabilitadas?: boolean | null;
  };
  cliente?: MeDetalheWire | null;
  advogado?: MeDetalheWire | null;
};

export type MeResult = {
  /** S3 object key for the profile photo (`fotoUrl`), or null when unset. */
  photoKey: string | null;
  /** Push preference from `usuarios.notificacoes_push_habilitadas`. */
  pushNotificationsEnabled: boolean;
};
