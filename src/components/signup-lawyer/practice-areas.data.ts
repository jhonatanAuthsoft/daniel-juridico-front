import { PRACTICE_AREA_NONE_ID } from './signup-step-navigation';

export const PRACTICE_AREA_OPTIONS = [
  {
    id: 'pautista',
    label: 'Pautista',
    apiCode: 'PAUTISTA',
  },
  {
    id: 'generalista',
    label: 'Generalista',
    description: 'Todas as especialidades do direito',
    apiCode: 'GENERALISTA',
  },
  {
    id: 'consultor',
    label: 'Consultor',
    apiCode: 'CONSULTOR',
  },
  {
    id: 'correspondente',
    label: 'Correspondente / Outras atividades',
    apiCode: 'CORRESPONDENTE',
  },
  {
    id: PRACTICE_AREA_NONE_ID,
    label: 'Nenhuma das anteriores',
    description: 'Selecione as especialidades a seguir.',
    apiCode: 'NENHUMA_DAS_ANTERIORES',
  },
] as const;

const API_CODE_TO_ID: Record<string, string> = Object.fromEntries(
  PRACTICE_AREA_OPTIONS.map((option) => [option.apiCode, option.id]),
);

const ID_TO_LABEL: Record<string, string> = Object.fromEntries(
  PRACTICE_AREA_OPTIONS.map((option) => [option.id, option.label]),
);

export function mapModalidadeCodeToPracticeAreaId(codigo: string): string | undefined {
  const normalized = codigo.trim().toUpperCase();
  return API_CODE_TO_ID[normalized];
}

export function formatPracticeAreasSummary(ids: readonly string[]): string {
  return ids
    .map((id) => ID_TO_LABEL[id] ?? id)
    .filter(Boolean)
    .join(', ');
}
