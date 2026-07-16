export type SelectOption = {
  value: string;
  label: string;
};

export const UF_OPTIONS: SelectOption[] = [
  { value: 'AC', label: 'AC' },
  { value: 'AL', label: 'AL' },
  { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' },
  { value: 'BA', label: 'BA' },
  { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' },
  { value: 'ES', label: 'ES' },
  { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' },
  { value: 'MT', label: 'MT' },
  { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' },
  { value: 'PA', label: 'PA' },
  { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' },
  { value: 'PE', label: 'PE' },
  { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' },
  { value: 'RN', label: 'RN' },
  { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' },
  { value: 'RR', label: 'RR' },
  { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' },
  { value: 'SE', label: 'SE' },
  { value: 'TO', label: 'TO' },
];

export const STATE_OPTIONS: SelectOption[] = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

/** Capitals / main cities per UF — placeholder until CEP lookup exists. */
export const CITIES_BY_UF: Record<string, SelectOption[]> = {
  AC: [{ value: 'rio-branco', label: 'Rio Branco' }],
  AL: [{ value: 'maceio', label: 'Maceió' }],
  AP: [{ value: 'macapa', label: 'Macapá' }],
  AM: [{ value: 'manaus', label: 'Manaus' }],
  BA: [
    { value: 'salvador', label: 'Salvador' },
    { value: 'feira-de-santana', label: 'Feira de Santana' },
    { value: 'vitoria-da-conquista', label: 'Vitória da Conquista' },
  ],
  CE: [
    { value: 'fortaleza', label: 'Fortaleza' },
    { value: 'juazeiro-do-norte', label: 'Juazeiro do Norte' },
  ],
  DF: [{ value: 'brasilia', label: 'Brasília' }],
  ES: [
    { value: 'vitoria', label: 'Vitória' },
    { value: 'vila-velha', label: 'Vila Velha' },
  ],
  GO: [
    { value: 'goiania', label: 'Goiânia' },
    { value: 'anapolis', label: 'Anápolis' },
  ],
  MA: [{ value: 'sao-luis', label: 'São Luís' }],
  MT: [{ value: 'cuiaba', label: 'Cuiabá' }],
  MS: [{ value: 'campo-grande', label: 'Campo Grande' }],
  MG: [
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'uberlandia', label: 'Uberlândia' },
  ],
  PA: [{ value: 'belem', label: 'Belém' }],
  PB: [{ value: 'joao-pessoa', label: 'João Pessoa' }],
  PR: [
    { value: 'curitiba', label: 'Curitiba' },
    { value: 'londrina', label: 'Londrina' },
  ],
  PE: [
    { value: 'recife', label: 'Recife' },
    { value: 'olinda', label: 'Olinda' },
  ],
  PI: [{ value: 'teresina', label: 'Teresina' }],
  RJ: [
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'niteroi', label: 'Niterói' },
  ],
  RN: [{ value: 'natal', label: 'Natal' }],
  RS: [
    { value: 'porto-alegre', label: 'Porto Alegre' },
    { value: 'caxias-do-sul', label: 'Caxias do Sul' },
  ],
  RO: [{ value: 'porto-velho', label: 'Porto Velho' }],
  RR: [{ value: 'boa-vista', label: 'Boa Vista' }],
  SC: [
    { value: 'florianopolis', label: 'Florianópolis' },
    { value: 'joinville', label: 'Joinville' },
  ],
  SP: [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'campinas', label: 'Campinas' },
    { value: 'santos', label: 'Santos' },
  ],
  SE: [{ value: 'aracaju', label: 'Aracaju' }],
  TO: [{ value: 'palmas', label: 'Palmas' }],
};

export const NEIGHBORHOOD_OPTIONS: SelectOption[] = [
  { value: 'centro', label: 'Centro' },
  { value: 'jardim', label: 'Jardim' },
  { value: 'vila', label: 'Vila' },
  { value: 'bairro-novo', label: 'Bairro Novo' },
  { value: 'outro', label: 'Outro' },
];

export const ISSUING_AUTHORITY_OPTIONS: SelectOption[] = [
  { value: 'SSP', label: 'SSP' },
  { value: 'DETRAN', label: 'DETRAN' },
  { value: 'IFP', label: 'IFP' },
  { value: 'PC', label: 'PC' },
  { value: 'PM', label: 'PM' },
  { value: 'outro', label: 'Outro' },
];

export const MARITAL_STATUS_OPTIONS: SelectOption[] = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao-estavel', label: 'União estável' },
];

export const PRONOUN_OPTIONS: SelectOption[] = [
  { value: 'ele-dele', label: 'Ele/Dele' },
  { value: 'ela-dela', label: 'Ela/Dela' },
  { value: 'elu-delu', label: 'Elu/Delu' },
  { value: 'nao-informar', label: 'Prefiro não informar' },
];
