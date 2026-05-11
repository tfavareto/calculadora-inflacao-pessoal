import { FALLBACK_IPCA } from './constants';

interface IBGESerie {
  serie: Record<string, string>;
}
interface IBGEResult {
  series: IBGESerie[];
}
interface IBGEVariable {
  resultados: IBGEResult[];
}

export async function fetchIPCARange(
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<Record<string, number>> {
  try {
    const url =
      `https://servicodados.ibge.gov.br/api/v3/agregados/433/periodos/` +
      `${startYYYYMM}-${endYYYYMM}/variaveis/63?localidades=N1[all]`;

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('IBGE API error');

    const data: IBGEVariable[] = await res.json();
    const serie = data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};

    const result: Record<string, number> = {};
    for (const [period, value] of Object.entries(serie)) {
      const num = parseFloat(value);
      if (!isNaN(num)) result[period] = num;
    }
    return Object.keys(result).length > 0 ? result : FALLBACK_IPCA;
  } catch {
    return FALLBACK_IPCA;
  }
}
