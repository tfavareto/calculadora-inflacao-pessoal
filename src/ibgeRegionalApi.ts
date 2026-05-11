import { FALLBACK_IPCA } from './constants';

/**
 * Busca o IPCA mensal para um município específico via IBGE SIDRA.
 *
 * Tabela 7169 — "IPCA - Variação mensal, acumulada no ano e acumulada em 12 meses"
 * Nível territorial: N6 (Municípios) — disponível para as 13 áreas de coleta do IPCA.
 * Variável 63 — Variação mensal (%).
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

export async function fetchIPCARegional(
  ibgeCode: string,
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<Record<string, number>> {
  try {
    const url =
      `https://servicodados.ibge.gov.br/api/v3/agregados/7169/periodos/` +
      `${startYYYYMM}-${endYYYYMM}/variaveis/63?localidades=N6[${ibgeCode}]`;

    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error(`IBGE regional API error: ${res.status}`);

    const data: IBGEVariable[] = await res.json();
    const serie = data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};

    const result: Record<string, number> = {};
    for (const [period, value] of Object.entries(serie)) {
      const num = parseFloat(value);
      if (!isNaN(num)) result[period] = num;
    }

    // Fallback para IPCA nacional se a região não tiver dados suficientes
    return Object.keys(result).length > 0 ? result : FALLBACK_IPCA;
  } catch {
    return FALLBACK_IPCA;
  }
}
