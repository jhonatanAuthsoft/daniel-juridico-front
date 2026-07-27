/**
 * Legal specialties catalog — codes must match the server catalog
 * (`especialidades` / `subespecialidades`, migrations V5 + V7).
 *
 * Selected child ids are `<SPECIALTY_CODE>:<SUBSPECIALTY_CODE>` so the
 * API mapper can derive both codes without extra lookups.
 *
 * // TODO: pegar a lista do banco com uma request.
 */

export type SpecialtyChild = {
  id: string;
  code: string;
  label: string;
};

export type SpecialtyCategory = {
  id: string;
  code: string;
  label: string;
  children: SpecialtyChild[];
};

export const SPECIALTY_ID_SEPARATOR = ':';

export function buildSpecialtyId(categoryCode: string, childCode: string): string {
  return `${categoryCode}${SPECIALTY_ID_SEPARATOR}${childCode}`;
}

export function parseSpecialtyId(
  id: string,
): { specialtyCode: string; subspecialtyCode: string } | null {
  const [specialtyCode, subspecialtyCode] = id.split(SPECIALTY_ID_SEPARATOR);
  if (!specialtyCode || !subspecialtyCode) {
    return null;
  }
  return { specialtyCode, subspecialtyCode };
}

function category(
  code: string,
  label: string,
  children: [code: string, label: string][],
): SpecialtyCategory {
  return {
    id: code,
    code,
    label,
    children: children.map(([childCode, childLabel]) => ({
      id: buildSpecialtyId(code, childCode),
      code: childCode,
      label: childLabel,
    })),
  };
}

export const SPECIALTY_CATEGORIES: SpecialtyCategory[] = [
  category('CIVIL', 'Direito Civil', [
    ['CONTRATOS', 'Contratos'],
    ['RESPONSABILIDADE_CIVIL', 'Responsabilidade Civil'],
    ['INDENIZACOES', 'Indenizações (danos morais e materiais)'],
    ['COBRANCA_EXECUCAO', 'Cobrança e Execução'],
    ['OBRIGACOES', 'Direito das Obrigações'],
    ['POSSE_PROPRIEDADE', 'Posse e Propriedade'],
    ['USUCAPIAO', 'Usucapião'],
    ['INVENTARIO_PARTILHA', 'Inventário e Partilha'],
    ['SUCESSOES', 'Sucessões'],
    ['TESTAMENTOS', 'Testamentos'],
    ['CONDOMINIOS', 'Condomínios'],
    ['DIREITOS_REAIS', 'Direitos Reais'],
  ]),
  category('CONSUMIDOR', 'Direito do Consumidor', [
    ['RELACOES_CONSUMO', 'Relações de Consumo'],
    ['ACOES_BANCOS', 'Ações contra Bancos'],
    ['ACOES_PLANOS_SAUDE', 'Ações contra Planos de Saúde'],
    ['ACOES_EMPRESAS_AEREAS', 'Ações contra Empresas Aéreas'],
    ['PROCON_JUIZADO', 'Procon e Juizado Especial'],
    ['CLAUSULAS_ABUSIVAS', 'Cláusulas Abusivas'],
    ['COBRANCA_INDEVIDA', 'Cobrança Indevida'],
    ['VICIOS_PRODUTO_SERVICO', 'Vícios de Produto e Serviço'],
    ['NEGATIVACAO_INDEVIDA', 'Negativação Indevida (Serasa/SPC)'],
  ]),
  category('TRABALHISTA', 'Direito Trabalhista', [
    ['RECLAMACAO_TRABALHISTA', 'Reclamação Trabalhista'],
    ['RESCISAO_CONTRATO', 'Rescisão de Contrato'],
    ['VERBAS_RESCISORIAS', 'Verbas Rescisórias'],
    ['HORAS_EXTRAS', 'Horas Extras'],
    ['ASSEDIO_MORAL', 'Assédio Moral'],
    ['ASSEDIO_SEXUAL', 'Assédio Sexual'],
    ['ACIDENTE_TRABALHO', 'Acidente de Trabalho'],
    ['ESTABILIDADE_PROVISORIA', 'Estabilidade Provisória'],
    ['ACORDOS_TRABALHISTAS', 'Acordos Trabalhistas'],
    ['DEFESA_EMPREGADOR', 'Direito do Empregador (Defesa)'],
  ]),
  category('PREVIDENCIARIO', 'Direito Previdenciário', [
    ['APOSENTADORIA_IDADE', 'Aposentadoria por Idade'],
    ['APOSENTADORIA_TEMPO', 'Aposentadoria por Tempo de Contribuição'],
    ['APOSENTADORIA_INVALIDEZ', 'Aposentadoria por Invalidez'],
    ['AUXILIO_DOENCA', 'Auxílio-Doença'],
    ['AUXILIO_ACIDENTE', 'Auxílio-Acidente'],
    ['BPC_LOAS', 'BPC/LOAS'],
    ['REVISAO_BENEFICIOS', 'Revisão de Benefícios'],
    ['PLANEJAMENTO_PREVIDENCIARIO', 'Planejamento Previdenciário'],
    ['PENSAO_MORTE', 'Pensão por Morte'],
  ]),
  category('CRIMINAL', 'Direito Penal', [
    ['DEFESA_CRIMINAL', 'Defesa Criminal'],
    ['TRIBUNAL_JURI', 'Tribunal do Júri'],
    ['CRIMES_CONTRA_PESSOA', 'Crimes Contra a Pessoa'],
    ['CRIMES_PATRIMONIAIS', 'Crimes Patrimoniais'],
    ['CRIMES_DIGITAIS', 'Crimes Digitais'],
    ['LEI_MARIA_PENHA', 'Lei Maria da Penha'],
    ['EXECUCAO_PENAL', 'Execução Penal'],
    ['HABEAS_CORPUS', 'Habeas Corpus'],
    ['ANPP', 'Acordo de Não Persecução Penal (ANPP)'],
  ]),
  category('FAMILIA', 'Direito de Família', [
    ['DIVORCIO', 'Divórcio'],
    ['PENSAO_ALIMENTICIA', 'Pensão Alimentícia'],
    ['GUARDA', 'Guarda'],
    ['REGULAMENTACAO_VISITAS', 'Regulamentação de Visitas'],
    ['RECONHECIMENTO_PATERNIDADE', 'Reconhecimento de Paternidade'],
    ['ADOCAO', 'Adoção'],
    ['UNIAO_ESTAVEL', 'União Estável'],
    ['PARTILHA_BENS', 'Partilha de Bens'],
    ['MEDIACAO_FAMILIAR', 'Mediação Familiar'],
  ]),
  category('EMPRESARIAL', 'Direito Empresarial / Societário', [
    ['CONSTITUICAO_EMPRESAS', 'Constituição de Empresas'],
    ['CONTRATOS_EMPRESARIAIS', 'Contratos Empresariais'],
    ['ALTERACAO_CONTRATUAL', 'Alteração Contratual'],
    ['DISSOLUCAO_SOCIEDADE', 'Dissolução de Sociedade'],
    ['RECUPERACAO_JUDICIAL', 'Recuperação Judicial'],
    ['FALENCIA', 'Falência'],
    ['GOVERNANCA_CORPORATIVA', 'Governança Corporativa'],
    ['ACORDO_SOCIOS', 'Acordo de Sócios'],
    ['COMPLIANCE_EMPRESARIAL', 'Compliance Empresarial'],
  ]),
  category('TRIBUTARIO', 'Direito Tributário', [
    ['PLANEJAMENTO_TRIBUTARIO', 'Planejamento Tributário'],
    ['RECUPERACAO_TRIBUTOS', 'Recuperação de Tributos'],
    ['DEFESA_EXECUCAO_FISCAL', 'Defesa em Execução Fiscal'],
    ['ICMS', 'ICMS'],
    ['ISS', 'ISS'],
    ['IMPOSTO_RENDA', 'Imposto de Renda'],
    ['SIMPLES_NACIONAL', 'Simples Nacional'],
    ['AUTOS_INFRACAO', 'Autos de Infração'],
    ['CONTENCIOSO_FISCAL', 'Contencioso Administrativo Fiscal'],
  ]),
  category('IMOBILIARIO', 'Direito Imobiliário', [
    ['COMPRA_VENDA_IMOVEIS', 'Compra e Venda de Imóveis'],
    ['CONTRATOS_LOCACAO', 'Contratos de Locação'],
    ['DESPEJO', 'Despejo'],
    ['REGULARIZACAO_IMOVEIS', 'Regularização de Imóveis'],
    ['USUCAPIAO', 'Usucapião'],
    ['CONDOMINIOS', 'Condomínios'],
    ['INCORPORACAO_IMOBILIARIA', 'Incorporação Imobiliária'],
    ['DISTRATO_IMOBILIARIO', 'Distrato Imobiliário'],
  ]),
  category('DIGITAL', 'Direito Digital / Tecnologia', [
    ['LGPD', 'LGPD'],
    ['PROTECAO_DADOS', 'Proteção de Dados'],
    ['CRIMES_DIGITAIS', 'Crimes Digitais'],
    ['CONTRATOS_TECNOLOGIA', 'Contratos de Tecnologia'],
    ['COMPLIANCE_DIGITAL', 'Compliance Digital'],
    ['PROPRIEDADE_INTELECTUAL_DIGITAL', 'Propriedade Intelectual Digital'],
    ['DIREITO_STARTUPS', 'Direito para Startups'],
    ['TERMOS_USO_POLITICAS', 'Termos de Uso e Políticas de Privacidade'],
  ]),
  category('PROPRIEDADE_INTELECTUAL', 'Propriedade Intelectual', [
    ['REGISTRO_MARCA', 'Registro de Marca'],
    ['REGISTRO_PATENTE', 'Registro de Patente'],
    ['DIREITOS_AUTORAIS', 'Direitos Autorais'],
    ['CONTRATOS_LICENCIAMENTO', 'Contratos de Licenciamento'],
    ['CONCORRENCIA_DESLEAL', 'Concorrência Desleal'],
    ['FRANQUIAS', 'Franquias (PI)'],
  ]),
  category('ADMINISTRATIVO', 'Direito Administrativo', [
    ['LICITACOES', 'Licitações'],
    ['CONTRATOS_ADMINISTRATIVOS', 'Contratos Administrativos'],
    ['SERVIDORES_PUBLICOS', 'Servidores Públicos'],
    ['PROCESSOS_ADMINISTRATIVOS', 'Processos Administrativos'],
    ['IMPROBIDADE_ADMINISTRATIVA', 'Improbidade Administrativa'],
    ['TRIBUNAIS_CONTAS', 'Defesa em Tribunais de Contas'],
  ]),
  category('AMBIENTAL', 'Direito Ambiental', [
    ['LICENCIAMENTO_AMBIENTAL', 'Licenciamento Ambiental'],
    ['MULTAS_AMBIENTAIS', 'Multas Ambientais'],
    ['CRIMES_AMBIENTAIS', 'Crimes Ambientais'],
    ['COMPLIANCE_AMBIENTAL', 'Compliance Ambiental'],
    ['REGULARIZACAO_AMBIENTAL', 'Regularização Ambiental'],
  ]),
  category('SAUDE', 'Direito à Saúde', [
    ['ACOES_PLANOS_SAUDE', 'Ações contra Planos de Saúde'],
    ['FORNECIMENTO_MEDICAMENTOS', 'Fornecimento de Medicamentos'],
    ['JUDICIALIZACAO_SAUDE', 'Judicialização da Saúde'],
    ['ERRO_MEDICO', 'Erro Médico'],
    ['DEFESA_PROFISSIONAIS_SAUDE', 'Defesa de Profissionais da Saúde'],
  ]),
  category('INTERNACIONAL', 'Direito Internacional', [
    ['CONTRATOS_INTERNACIONAIS', 'Contratos Internacionais'],
    ['IMIGRACAO', 'Imigração'],
    ['VISTOS', 'Vistos'],
    ['HOMOLOGACAO_SENTENCA', 'Homologação de Sentença Estrangeira'],
    ['INTERNACIONAL_PRIVADO', 'Direito Internacional Privado'],
  ]),
  category('CORRESPONDENCIA', 'Correspondência Jurídica', [
    ['CARGA_PROCESSOS', 'Carga Rápida de Processos'],
    ['COPIA_AUTOS', 'Cópia de Autos'],
    ['PROTOCOLOS', 'Protocolos'],
    ['DILIGENCIAS_FORUM', 'Diligências em Fórum'],
    ['AUDIENCIAS_PREPOSTO', 'Audiências como Preposto'],
    ['DESPACHOS_JUIZ', 'Despachos com Juiz'],
    ['SUSTENTACAO_ORAL', 'Sustentação Oral'],
  ]),
];
