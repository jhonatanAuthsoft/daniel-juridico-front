import { maskCep, maskCnpj, maskCpf, maskRg } from '@/utils/br-input';

import type {
  ClientDocumentType,
  ClientEditProfile,
  LawyerEditOabEntry,
  LawyerEditProfile,
  MeCatalogItemWire,
  MeDetalheWire,
  MeEnderecoWire,
  MeOabWire,
  MePerfilWire,
  MeResult,
  MeWireResponse,
} from './me.types';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asYear(value: unknown): string {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  const digits = asText(value).replace(/\D/g, '');
  return digits.length === 4 ? digits : asText(value);
}

function normalizePhotoKey(value: unknown): string | null {
  const trimmed = asText(value);
  return trimmed.length > 0 ? trimmed : null;
}

function isProfileUnavailable(perfil: MePerfilWire | null | undefined): boolean {
  return asText(perfil?.disponibilidade).toUpperCase() === 'INDISPONIVEL';
}

function mapDocumentType(value: unknown): ClientDocumentType {
  return asText(value).toUpperCase() === 'CNPJ' ? 'cnpj' : 'cpf';
}

const FORMA_COBRANCA_TO_BILLING: Record<string, string> = {
  HONORARIOS_CONTRATUAIS: 'contractual',
  HONORARIOS_PERCENTUAIS: 'percentage',
  HONORARIOS_ARBITRADOS: 'court_awarded',
  OUTROS_A_COMBINAR: 'to_be_agreed',
};

function mapBillingMethods(items: MeCatalogItemWire[] | null | undefined): string[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item) => FORMA_COBRANCA_TO_BILLING[asText(item?.codigo).toUpperCase()])
    .filter((id): id is string => Boolean(id));
}

function mapPhotoUris(urls: MeOabWire['fotosUrls']): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }
  return urls.map((url) => asText(url)).filter((url) => url.length > 0);
}

function toBrDate(value: unknown): string {
  const text = asText(value);
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!iso) {
    return text;
  }
  return `${iso[3]}/${iso[2]}/${iso[1]}`;
}

function mapOabEntry(wire: MeOabWire): LawyerEditOabEntry {
  const photoKeys = mapPhotoUris(wire.fotosUrls);
  return {
    number: asText(wire.numero),
    uf: asText(wire.uf).toUpperCase(),
    issueDate: toBrDate(wire.dataExpedicao),
    photoUris: photoKeys,
    photoKeys,
  };
}

function mapAddress(endereco: MeEnderecoWire) {
  return {
    cep: maskCep(asText(endereco.cep)),
    state: asText(endereco.estado).toUpperCase(),
    city: asText(endereco.cidade),
    neighborhood: asText(endereco.bairro),
    street: asText(endereco.logradouro),
    number: asText(endereco.numero),
    complement: asText(endereco.complemento),
  };
}

function mapClienteDetalheToProfile(
  detalhe: MeDetalheWire,
  email: string,
): ClientEditProfile {
  const perfil: MePerfilWire = detalhe.perfil ?? {};
  const endereco: MeEnderecoWire = detalhe.endereco ?? {};
  const documentType = mapDocumentType(perfil.tipoDocumento);
  const isCnpj = documentType === 'cnpj';
  const fullName = isCnpj
    ? asText(perfil.razaoSocial) ||
      asText(perfil.nomeCompleto) ||
      ''
    : asText(perfil.nomeCompleto);

  return {
    fullName,
    email: asText(email),
    documentType,
    documentNumber: isCnpj
      ? maskCnpj(asText(perfil.numeroDocumento))
      : maskCpf(asText(perfil.numeroDocumento)),
    rg: isCnpj ? '' : maskRg(asText(perfil.rg)),
    ...mapAddress(endereco),
    pronouns: asText(perfil.pronomes).toUpperCase(),
    profession: asText(perfil.profissao) || asText(perfil.areaAtuacao),
    maritalStatus: asText(perfil.estadoCivil),
    monthlyIncome: asText(perfil.faixaRenda),
  };
}

function mapClientProfile(wire: MeWireResponse): ClientEditProfile | null {
  if (!wire.cliente) {
    return null;
  }

  const profile = mapClienteDetalheToProfile(wire.cliente, wire.usuario?.email ?? '');
  if (!profile.fullName) {
    profile.fullName = asText(wire.usuario?.nomeCompleto);
  }
  return profile;
}

function mapAdvogadoDetalheToProfile(
  detalhe: MeDetalheWire,
  email: string,
): LawyerEditProfile {
  const perfil: MePerfilWire = detalhe.perfil ?? {};
  const endereco: MeEnderecoWire = detalhe.endereco ?? {};
  const oabs = Array.isArray(detalhe.oabs) ? detalhe.oabs : [];
  const primary = oabs.find((oab) => oab.principal) ?? oabs[0];
  const supplemental = oabs.filter((oab) => oab !== primary).map(mapOabEntry);
  const mappedPrimary = primary ? mapOabEntry(primary) : null;

  return {
    fullName: asText(perfil.nomeCompleto),
    email: asText(email),
    ...mapAddress(endereco),
    billingMethods: mapBillingMethods(detalhe.formasCobranca),
    biography: asText(perfil.biografia),
    pronouns: asText(perfil.pronomeTratamento).toUpperCase(),
    oabNumber: mappedPrimary?.number ?? '',
    oabUf: mappedPrimary?.uf ?? '',
    oabIssueDate: mappedPrimary?.issueDate ?? '',
    oabPhotoUris: mappedPrimary?.photoUris ?? [],
    oabPhotoKeys: mappedPrimary?.photoKeys ?? [],
    supplementalOabs: supplemental,
    university: asText(perfil.universidade),
    course: asText(perfil.curso),
    graduationYear: asYear(perfil.anoFormacao),
  };
}

function mapLawyerProfile(wire: MeWireResponse): LawyerEditProfile | null {
  if (!wire.advogado) {
    return null;
  }

  const profile = mapAdvogadoDetalheToProfile(
    wire.advogado,
    wire.usuario?.email ?? '',
  );
  if (!profile.fullName) {
    profile.fullName = asText(wire.usuario?.nomeCompleto);
  }
  return profile;
}

/**
 * Maps `GET /usuarios/me` wire payload to the fields needed by profile UI.
 */
export function mapMeWireToResult(wire: MeWireResponse): MeResult {
  const photoKey =
    normalizePhotoKey(wire.cliente?.perfil?.fotoUrl) ??
    normalizePhotoKey(wire.advogado?.perfil?.fotoUrl);

  return {
    photoKey,
    pushNotificationsEnabled:
      wire.usuario?.notificacoesPushHabilitadas !== false,
    profileUnavailable: isProfileUnavailable(wire.advogado?.perfil),
    clientProfile: mapClientProfile(wire),
    lawyerProfile: mapLawyerProfile(wire),
  };
}

/**
 * Applies a `PATCH /clientes/me/*` detalhe payload onto the cached `/me` result.
 */
export function mergeClienteDetalheIntoMe(
  current: MeResult | undefined,
  detalhe: MeDetalheWire,
): MeResult {
  const email = current?.clientProfile?.email ?? '';
  const photoKey =
    normalizePhotoKey(detalhe.perfil?.fotoUrl) ?? current?.photoKey ?? null;

  return {
    photoKey,
    pushNotificationsEnabled: current?.pushNotificationsEnabled ?? true,
    profileUnavailable: false,
    clientProfile: mapClienteDetalheToProfile(detalhe, email),
    lawyerProfile: current?.lawyerProfile ?? null,
  };
}

/**
 * Applies a `PATCH /advogados/me/*` detalhe payload onto the cached `/me` result.
 */
export function mergeAdvogadoDetalheIntoMe(
  current: MeResult | undefined,
  detalhe: MeDetalheWire,
): MeResult {
  const email = current?.lawyerProfile?.email ?? '';
  const photoKey =
    normalizePhotoKey(detalhe.perfil?.fotoUrl) ?? current?.photoKey ?? null;
  const profileUnavailable =
    asText(detalhe.perfil?.disponibilidade).length > 0
      ? isProfileUnavailable(detalhe.perfil)
      : (current?.profileUnavailable ?? false);

  return {
    photoKey,
    pushNotificationsEnabled: current?.pushNotificationsEnabled ?? true,
    profileUnavailable,
    clientProfile: current?.clientProfile ?? null,
    lawyerProfile: mapAdvogadoDetalheToProfile(detalhe, email),
  };
}
