/**
 * Regiões Metropolitanas com IPCA regional oficial — IBGE SIDRA Tabela 7060
 * Nível territorial N7 (Regiões Metropolitanas).
 *
 * Apenas 10 regiões possuem série própria. Brasília, Goiânia, Campo Grande
 * e Rio Branco não são calculadas separadamente pelo IBGE nesta tabela.
 *
 * Fonte: https://sidra.ibge.gov.br/tabela/7060
 * Variável 63 — Variação mensal (%)
 */

export interface Region {
  ibgeCode: string;  // Código do município principal (chave de identificação)
  n7Code: string;    // Código N7 da Região Metropolitana no SIDRA (tabela 7060)
  city: string;
  state: string;
  label: string;
  emoji: string;
}

export const REGIONS: Region[] = [
  { ibgeCode: '1501402', n7Code: '1501', city: 'Belém',          state: 'PA', label: 'Belém (PA)',          emoji: '🌊' },
  { ibgeCode: '2304400', n7Code: '2301', city: 'Fortaleza',      state: 'CE', label: 'Fortaleza (CE)',      emoji: '☀️' },
  { ibgeCode: '2611606', n7Code: '2601', city: 'Recife',         state: 'PE', label: 'Recife (PE)',         emoji: '🦀' },
  { ibgeCode: '2927408', n7Code: '2901', city: 'Salvador',       state: 'BA', label: 'Salvador (BA)',       emoji: '🎭' },
  { ibgeCode: '3106200', n7Code: '3101', city: 'Belo Horizonte', state: 'MG', label: 'Belo Horizonte (MG)', emoji: '⛰️' },
  { ibgeCode: '3205309', n7Code: '3201', city: 'Grande Vitória', state: 'ES', label: 'Grande Vitória (ES)', emoji: '🌿' },
  { ibgeCode: '3304557', n7Code: '3301', city: 'Rio de Janeiro', state: 'RJ', label: 'Rio de Janeiro (RJ)', emoji: '🏖️' },
  { ibgeCode: '3550308', n7Code: '3501', city: 'São Paulo',      state: 'SP', label: 'São Paulo (SP)',      emoji: '🏙️' },
  { ibgeCode: '4106902', n7Code: '4101', city: 'Curitiba',       state: 'PR', label: 'Curitiba (PR)',       emoji: '🌲' },
  { ibgeCode: '4314902', n7Code: '4301', city: 'Porto Alegre',   state: 'RS', label: 'Porto Alegre (RS)',   emoji: '🍷' },
];

export function getRegion(ibgeCode: string): Region | undefined {
  return REGIONS.find((r) => r.ibgeCode === ibgeCode);
}
