import { formatAddressSummary } from '@/components/client-edit-data/client-edit-profile-summary';
import type { LawyerEditOabEntry, LawyerEditProfile } from '@/data/auth';
import { TREATMENT_PRONOUN_OPTIONS } from '@/constants/select-options';

export type { LawyerEditOabEntry, LawyerEditProfile };

export const BIOGRAPHY_MAX_LENGTH = 800;
export const OAB_PHOTO_MAX = 2;
export const OAB_PHOTO_ASPECT: [number, number] = [3, 2];
export const MAX_SUPPLEMENTAL_OABS = 5;

export const BILLING_METHOD_OPTIONS = [
  { id: 'contractual', label: 'Honorários contratuais' },
  { id: 'percentage', label: 'Honorários percentuais' },
  { id: 'court_awarded', label: 'Honorários arbitrados judicialmente' },
  { id: 'to_be_agreed', label: 'A combinar' },
] as const;

export type DocumentationForm = {
  oabNumber: string;
  oabUf: string;
  oabIssueDate: string;
  oabPhotoUris: string[];
  oabPhotoKeys: string[];
  supplementalOabs: LawyerEditOabEntry[];
};

const BILLING_SUMMARY_LABEL: Record<string, { full: string; rest: string }> = {
  contractual: { full: 'Honorários Contratuais', rest: 'Contratuais' },
  percentage: { full: 'Honorários Percentuais', rest: 'Percentuais' },
  court_awarded: {
    full: 'Honorários arbitrados judicialmente',
    rest: 'Arbitrados judicialmente',
  },
  to_be_agreed: { full: 'A combinar', rest: 'A combinar' },
};

export function formatLawyerAddressSummary(
  profile: Pick<LawyerEditProfile, 'street' | 'neighborhood' | 'city' | 'state'>,
): string {
  return formatAddressSummary(profile);
}

export function formatBillingSummary(methodIds: readonly string[]): string {
  return methodIds
    .map((id, index) => {
      const labels = BILLING_SUMMARY_LABEL[id];
      if (!labels) {
        return id;
      }
      return index === 0 ? labels.full : labels.rest;
    })
    .filter(Boolean)
    .join(', ');
}

export function formatOabSummary(number: string, uf: string): string {
  const oabNumber = number.trim();
  const oabUf = uf.trim().toUpperCase();
  if (!oabNumber) {
    return '';
  }
  return oabUf ? `${oabNumber} - ${oabUf}` : oabNumber;
}

export function formatOabHubLabel(number: string, uf: string): string {
  const oabNumber = number.trim();
  const oabUf = uf.trim().toUpperCase();
  if (!oabNumber) {
    return '';
  }
  return oabUf ? `OAB/${oabUf} ${oabNumber}` : `OAB ${oabNumber}`;
}

export function formatTreatmentPronounChip(pronouns: string): string {
  const normalized = pronouns.trim().toUpperCase();
  if (normalized === 'DOUTORA') {
    return 'Doutora/(Dra)';
  }
  if (normalized === 'DOUTOR') {
    return 'Doutor/(Dr)';
  }
  return (
    TREATMENT_PRONOUN_OPTIONS.find((option) => option.value === normalized)?.label ?? ''
  );
}

export function createEmptySupplementalOab(): LawyerEditOabEntry {
  return {
    number: '',
    uf: '',
    issueDate: '',
    photoUris: [],
    photoKeys: [],
  };
}
