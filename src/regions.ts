/**
 * Áreas de coleta oficiais do IPCA — IBGE/SIDRA
 * O IBGE calcula o IPCA para 13 municípios/regiões metropolitanas específicas.
 * Referência: https://www.ibge.gov.br/estatisticas/economicas/precos-custos-e-indices-de-precos/9173-ipca.html
 */

export interface Region {
  ibgeCode: string;   // Código do município no IBGE
  city: string;       // Nome da cidade
  state: string;      // UF
  label: string;      // Exibição: "São Paulo (SP)"
  emoji: string;
}

export const REGIONS: Region[] = [
  { ibgeCode: '1200401', city: 'Rio Branco',      state: 'AC', label: 'Rio Branco (AC)',      emoji: '🌳' },
  { ibgeCode: '1501402', city: 'Belém',           state: 'PA', label: 'Belém (PA)',           emoji: '🌊' },
  { ibgeCode: '2304400', city: 'Fortaleza',       state: 'CE', label: 'Fortaleza (CE)',       emoji: '☀️' },
  { ibgeCode: '2611606', city: 'Recife',          state: 'PE', label: 'Recife (PE)',          emoji: '🦀' },
  { ibgeCode: '2927408', city: 'Salvador',        state: 'BA', label: 'Salvador (BA)',        emoji: '🎭' },
  { ibgeCode: '3106200', city: 'Belo Horizonte',  state: 'MG', label: 'Belo Horizonte (MG)', emoji: '⛰️' },
  { ibgeCode: '3304557', city: 'Rio de Janeiro',  state: 'RJ', label: 'Rio de Janeiro (RJ)', emoji: '🏖️' },
  { ibgeCode: '3550308', city: 'São Paulo',       state: 'SP', label: 'São Paulo (SP)',       emoji: '🏙️' },
  { ibgeCode: '4106902', city: 'Curitiba',        state: 'PR', label: 'Curitiba (PR)',        emoji: '🌲' },
  { ibgeCode: '4314902', city: 'Porto Alegre',    state: 'RS', label: 'Porto Alegre (RS)',    emoji: '🍷' },
  { ibgeCode: '5002704', city: 'Campo Grande',    state: 'MS', label: 'Campo Grande (MS)',    emoji: '🌾' },
  { ibgeCode: '5208707', city: 'Goiânia',         state: 'GO', label: 'Goiânia (GO)',         emoji: '🌻' },
  { ibgeCode: '5300108', city: 'Brasília',        state: 'DF', label: 'Brasília (DF)',        emoji: '🏛️' },
];

export function getRegion(ibgeCode: string): Region | undefined {
  return REGIONS.find((r) => r.ibgeCode === ibgeCode);
}
