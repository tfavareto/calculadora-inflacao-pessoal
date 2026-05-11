import { REGIONS } from './regions';

/**
 * Busca o IPCA mensal regional via IBGE SIDRA.
 *
 * Tabela 7060 — "IPCA - Variação mensal, acumulada no ano e acumulada em 12 meses"
 * Nível territorial: N7 (Regiões Metropolitanas)
 * Variável 63 — Variação mensal (%)
 *
 * Regiões disponíveis (10): Belém, Fortaleza, Recife, Salvador, Belo Horizonte,
 * Grande Vitória, Rio de Janeiro, São Paulo, Curitiba, Porto Alegre.
 *
 * Referência SIDRA: https://sidra.ibge.gov.br/tabela/7060
 */

interface IBGESerie {
  localidade: { id: string; nome: string };
  serie: Record<string, string>;
}
interface IBGEResult { series: IBGESerie[] }
interface IBGEVariable { resultados: IBGEResult[] }

export async function fetchIPCARegional(
  ibgeCode: string,
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<Record<string, number>> {
  const region = REGIONS.find((r) => r.ibgeCode === ibgeCode);
  if (!region) return {};

  try {
    // Fetch direto pelo código N7 exato da região metropolitana
    const url =
      `https://servicodados.ibge.gov.br/api/v3/agregados/7060/periodos/` +
      `${startYYYYMM}-${endYYYYMM}/variaveis/63?localidades=N7[${region.n7Code}]`;

    const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!res.ok) throw new Error(`IBGE SIDRA error: ${res.status}`);

    const data: IBGEVariable[] = await res.json();
    const serie = data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};

    const result: Record<string, number> = {};
    for (const [period, value] of Object.entries(serie)) {
      const num = parseFloat(value);
      if (!isNaN(num)) result[period] = num;
    }

    return result; // retorna {} se vazio — App.tsx faz o fallback para nacional
  } catch (err) {
    console.warn('[IPCA Regional] Erro ao buscar dados:', err);
    return {};
  }
}
