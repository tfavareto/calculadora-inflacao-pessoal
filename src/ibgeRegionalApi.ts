import { FALLBACK_IPCA } from './constants';
import { REGIONS } from './regions';

/**
 * Busca o IPCA mensal regional via IBGE SIDRA.
 *
 * Tabela 7169 — "IPCA - Variação mensal, acumulada no ano e acumulada em 12 meses"
 * Nível territorial: N7 (Regiões Metropolitanas e municípios selecionados do IPCA).
 * Variável 63 — Variação mensal (%).
 *
 * Estratégia: busca TODAS as regiões (N7[all]) e filtra pelo nome da cidade,
 * evitando dependência de códigos internos do SIDRA que variam por tabela.
 *
 * Referência SIDRA: https://sidra.ibge.gov.br/tabela/7169
 */

interface IBGESerie {
  localidade: { id: string; nome: string };
  serie: Record<string, string>;
}
interface IBGEResult {
  series: IBGESerie[];
}
interface IBGEVariable {
  resultados: IBGEResult[];
}

// Cache em memória para evitar múltiplos fetches da mesma janela de período
const _cache: Record<string, { data: IBGESerie[]; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 min

async function fetchAllRegionalSeries(
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<IBGESerie[]> {
  const cacheKey = `${startYYYYMM}-${endYYYYMM}`;
  const cached = _cache[cacheKey];
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const url =
    `https://servicodados.ibge.gov.br/api/v3/agregados/7169/periodos/` +
    `${startYYYYMM}-${endYYYYMM}/variaveis/63?localidades=N7[all]`;

  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`IBGE SIDRA error: ${res.status}`);

  const data: IBGEVariable[] = await res.json();
  const series: IBGESerie[] = data?.[0]?.resultados?.[0]?.series ?? [];

  _cache[cacheKey] = { data: series, ts: Date.now() };
  return series;
}

export async function fetchIPCARegional(
  ibgeCode: string,
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<Record<string, number>> {
  const region = REGIONS.find((r) => r.ibgeCode === ibgeCode);
  if (!region) return FALLBACK_IPCA;

  try {
    const series = await fetchAllRegionalSeries(startYYYYMM, endYYYYMM);

    // Normaliza texto para comparação
    const normalize = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

    const cityNorm  = normalize(region.city);
    const stateNorm = normalize(region.state);

    // 1ª tentativa: match exato pelo nome da cidade
    let matched = series.find((s) => normalize(s.localidade.nome).includes(cityNorm));

    // 2ª tentativa: match pelo estado (ex: "- SP" no nome da localidade)
    if (!matched) {
      matched = series.find((s) => normalize(s.localidade.nome).includes(stateNorm));
    }

    if (!matched) throw new Error(`Localidade não encontrada: ${region.city}`);

    const result: Record<string, number> = {};
    for (const [period, value] of Object.entries(matched.serie)) {
      const num = parseFloat(value);
      if (!isNaN(num)) result[period] = num;
    }

    return Object.keys(result).length > 0 ? result : FALLBACK_IPCA;
  } catch (err) {
    console.warn('[IPCA Regional] Fallback para nacional:', err);
    return FALLBACK_IPCA;
  }
}

/**
 * Retorna todos os dados regionais de uma vez (usado na página Minha Cidade
 * para exibir a lista completa de regiões disponíveis no SIDRA).
 */
export async function fetchAllRegionalIPCA(
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<Record<string, Record<string, number>>> {
  try {
    const series = await fetchAllRegionalSeries(startYYYYMM, endYYYYMM);
    const result: Record<string, Record<string, number>> = {};

    for (const s of series) {
      const parsed: Record<string, number> = {};
      for (const [period, value] of Object.entries(s.serie)) {
        const num = parseFloat(value);
        if (!isNaN(num)) parsed[period] = num;
      }
      result[s.localidade.id] = parsed;
    }

    return result;
  } catch {
    return {};
  }
}
