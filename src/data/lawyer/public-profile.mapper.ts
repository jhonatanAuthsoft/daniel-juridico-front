import type {
  PublicLawyerCatalogItem,
  PublicLawyerOab,
  PublicLawyerProfile,
  PublicLawyerProfileWire,
} from './public-profile.types';

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function mapCatalogItems(
  items: PublicLawyerProfileWire['modalidades'],
): PublicLawyerCatalogItem[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item) => ({
      code: asText(item?.codigo),
      name: asText(item?.nome),
    }))
    .filter((item) => item.code.length > 0 || item.name.length > 0);
}

function mapOab(
  wire: PublicLawyerProfileWire['oabPrincipal'],
): PublicLawyerOab | null {
  if (!wire) {
    return null;
  }
  const number = asText(wire.numero);
  const uf = asText(wire.uf).toUpperCase();
  if (!number) {
    return null;
  }
  return {
    number,
    uf,
    isPrimary: Boolean(wire.principal),
  };
}

function formatOabLabel(oab: PublicLawyerOab | null): string {
  if (!oab) {
    return '';
  }
  return oab.uf ? `OAB ${oab.number}/${oab.uf}` : `OAB ${oab.number}`;
}

function mapHonorific(pronoun: string | null | undefined): string {
  const normalized = asText(pronoun).toUpperCase();
  if (normalized === 'DOUTOR') {
    return 'Doutor/Dr.';
  }
  if (normalized === 'DOUTORA') {
    return 'Doutora/Dra.';
  }
  return '';
}

function mapAddressLabel(
  wire: PublicLawyerProfileWire['endereco'],
): string {
  if (!wire) {
    return '';
  }
  const bairro = asText(wire.bairro);
  const cidade = asText(wire.cidade);
  const estado = asText(wire.estado).toUpperCase();
  const cityState = [cidade, estado].filter(Boolean).join(' - ');
  if (bairro && cityState) {
    return `${bairro}, ${cityState}`;
  }
  return cityState || bairro;
}

/**
 * Maps `GET /advogados/{id}` wire payload to the client profile view model.
 */
export function mapPublicLawyerProfileWireToResult(
  wire: PublicLawyerProfileWire,
): PublicLawyerProfile {
  const primaryOab = mapOab(wire.oabPrincipal);
  const supplementalOabs = (wire.oabsSuplementares ?? [])
    .map((item) => mapOab(item))
    .filter((item): item is PublicLawyerOab => item != null);

  const name = asText(wire.nome) || asText(wire.nomeCompleto) || 'Advogado';
  const photoKey = asText(wire.fotoUrl) || null;

  return {
    id: asText(wire.id),
    name,
    fullName: asText(wire.nomeCompleto) || name,
    socialName: asText(wire.nomeSocial) || null,
    honorific: mapHonorific(wire.pronomeTratamento),
    photoKey,
    biography: asText(wire.biografia),
    availability: asText(wire.disponibilidade) || null,
    averageRating: asNumber(wire.mediaAvaliacoes),
    totalReviews: Math.max(0, asNumber(wire.totalAvaliacoes) ?? 0),
    university: asText(wire.universidade),
    course: asText(wire.curso),
    graduationYear: asNumber(wire.anoFormacao),
    practiceSince: asText(wire.atuacaoDesde) || null,
    yearsOfExperience: Math.max(0, asNumber(wire.anosExperiencia) ?? 0),
    addressLabel: mapAddressLabel(wire.endereco),
    primaryOab,
    supplementalOabs,
    modalities: mapCatalogItems(wire.modalidades),
    specialties: mapCatalogItems(wire.especialidades),
    subspecialties: mapCatalogItems(wire.subespecialidades),
    billingMethods: mapCatalogItems(wire.formasCobranca),
    serviceAreas: (wire.areasAtuacao ?? [])
      .map((area) => ({
        state: asText(area?.estado).toUpperCase(),
        city: asText(area?.cidade),
      }))
      .filter((area) => area.state || area.city),
  };
}

export function formatPublicLawyerOabLabel(oab: PublicLawyerOab | null): string {
  return formatOabLabel(oab);
}

export function formatPublicLawyerRegistration(
  profile: PublicLawyerProfile,
): string {
  return formatOabLabel(profile.primaryOab);
}

export function formatPublicLawyerEducation(
  profile: PublicLawyerProfile,
): string {
  return [profile.course, profile.university].filter(Boolean).join(' — ');
}

export function formatPublicLawyerModalities(
  profile: PublicLawyerProfile,
): string {
  return profile.modalities.map((item) => item.name || item.code).join(', ');
}
