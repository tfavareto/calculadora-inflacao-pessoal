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

function parseSerie(data: IBGEVariable[]): Record<string, number> {
  const serie = data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};
  const result: Record<string, number> = {};
  for (const [period, value] of Object.entries(serie)) {
    const num = parseFloat(value);
    if (!isNaN(num)) result[period] = num;
  }
  return result;
}

export async function fetchIPCARange(
  startYYYYMM: string,
  endYYYYMM: string,
): Promise<Record<string, number>> {
  const period = `${startYYYYMM}-${endYYYYMM}`;
  const base = 'https://servicodados.ibge.gov.br/api/v3/agregados';
  const opts = { signal: AbortSignal.timeout(10000) };

  try {
    // Tabela 433 — IPCA nacional oficial
    const url433 = `${base}/433/periodos/${period}/variaveis/63?localidades=N1[all]`;
    const res433 = await fetch(url433, opts);
    if (res433.ok) {
      const parsed = parseSerie(await res433.json());
      if (Object.keys(parsed).length > 0) return parsed;
    }
  } catch { /* fallthrough */ }

  try {
    // Tabela 7060 — fallback (cobre N1 Brasil com a mesma variável 63)
    const url7060 = `${base}/7060/periodos/${period}/variaveis/63?localidades=N1[all]`;
    const res7060 = await fetch(url7060, opts);
    if (res7060.ok) {
      const parsed = parseSerie(await res7060.json());
      if (Object.keys(parsed).length > 0) return parsed;
    }
  } catch { /* fallthrough */ }

  return FALLBACK_IPCA;
}
