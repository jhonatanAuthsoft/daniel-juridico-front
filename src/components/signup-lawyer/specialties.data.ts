export type SpecialtyChild = {
  id: string;
  label: string;
};

export type SpecialtyCategory = {
  id: string;
  label: string;
  children: SpecialtyChild[];
};

export const SPECIALTY_CATEGORIES: SpecialtyCategory[] = [
  {
    id: 'civil',
    label: 'Direito Civil',
    children: [
      { id: 'civil-contratos', label: 'Contratos' },
      { id: 'civil-responsabilidade', label: 'Responsabilidade Civil' },
      { id: 'civil-cobranca', label: 'Cobrança e Execução' },
    ],
  },
  {
    id: 'consumidor',
    label: 'Direito do Consumidor',
    children: [
      { id: 'consumidor-relacoes', label: 'Relações de Consumo' },
      { id: 'consumidor-indenizacao', label: 'Indenizações' },
      { id: 'consumidor-contratos', label: 'Contratos de Consumo' },
    ],
  },
  {
    id: 'trabalhista',
    label: 'Direito Trabalhista',
    children: [
      { id: 'trabalhista-reclamacoes', label: 'Reclamações Trabalhistas' },
      { id: 'trabalhista-acordos', label: 'Acordos' },
      { id: 'trabalhista-rescisao', label: 'Rescisão' },
    ],
  },
  {
    id: 'previdenciario',
    label: 'Direito Previdenciário',
    children: [
      { id: 'prev-aposentadoria', label: 'Aposentadoria' },
      { id: 'prev-beneficios', label: 'Benefícios' },
      { id: 'prev-revisao', label: 'Revisão de Benefícios' },
    ],
  },
  {
    id: 'penal',
    label: 'Direito Penal',
    children: [
      { id: 'penal-defesa', label: 'Defesa Criminal' },
      { id: 'penal-tribunal', label: 'Tribunal do Júri' },
      { id: 'penal-execucao', label: 'Execução Penal' },
    ],
  },
  {
    id: 'familia',
    label: 'Direito da Família',
    children: [
      { id: 'familia-divorcio', label: 'Divórcio' },
      { id: 'familia-alimentos', label: 'Alimentos' },
      { id: 'familia-guarda', label: 'Guarda e Visitação' },
    ],
  },
  {
    id: 'empresarial',
    label: 'Direito Empresarial',
    children: [
      { id: 'empresarial-societario', label: 'Societário' },
      { id: 'empresarial-contratos', label: 'Contratos Empresariais' },
      { id: 'empresarial-falencia', label: 'Falência e Recuperação' },
    ],
  },
];
