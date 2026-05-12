/**
 * Server-side IBGE SIDRA fetcher.
 * Tries table 433 (official IPCA) first, then falls back to table 7060.
 * Returns an empty record on failure — callers decide how to handle that.
 */

interface IBGESerie { serie: Record<string, string> }
interface IBGEResult { series: IBGESerie[] }
interface IBGEVariable { resultados: IBGEResult[] }

function parseSerie(data: IBGEVariable[]): Record<string, number> {
  const serie = data?.[0]?.resultados?.[0]?.series?.[0]?.serie ?? {};
  const result: Record<string, number> = {};
  for (const [period, value] of Object.entries(serie)) {
    const num = parseFloat(value as string);
    if (!isNaN(num)) result[period] = num;
  }
  return result;
}

async function sidraFetch(url: string): Promise<IBGEVariable[]> {
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`SIDRA ${res.status}`);
  return res.json() as Promise<IBGEVariable[]>;
}

const BASE = 'https://servicodados.ibge.gov.br/api/v3/agregados';

export async function fetchNationalIPCA(
  start: string,
  end: string,
): Promise<Record<string, number>> {
  const period = `${start}-${end}`;

  // 1) Try table 433 (official)
  try {
    const data = await sidraFetch(
      `${BASE}/433/periodos/${period}/variaveis/63?localidades=N1[all]`,
    );
    const parsed = parseSerie(data);
    if (Object.keys(parsed).length > 0) {
      console.log(`[IBGE] Nacional table 433: ${Object.keys(parsed).length} períodos`);
      return parsed;
    }
  } catch (e) {
    console.warn('[IBGE] Tabela 433 falhou:', (e as Error).message);
  }

  // 2) Fallback to table 7060 N1
  try {
    const data = await sidraFetch(
      `${BASE}/7060/periodos/${period}/variaveis/63?localidades=N1[all]`,
    );
    const parsed = parseSerie(data);
    if (Object.keys(parsed).length > 0) {
      console.log(`[IBGE] Nacional table 7060: ${Object.keys(parsed).length} períodos`);
      return parsed;
    }
  } catch (e) {
    console.warn('[IBGE] Tabela 7060 N1 falhou:', (e as Error).message);
  }

  return {};
}

export async function fetchRegionalIPCA(
  n7Code: string,
  start: string,
  end: string,
): Promise<Record<string, number>> {
  const period = `${start}-${end}`;
  try {
    const data = await sidraFetch(
      `${BASE}/7060/periodos/${period}/variaveis/63?localidades=N7[${n7Code}]`,
    );
    const parsed = parseSerie(data);
    console.log(`[IBGE] Regional N7=${n7Code}: ${Object.keys(parsed).length} períodos`);
    return parsed;
  } catch (e) {
    console.warn(`[IBGE] Regional N7=${n7Code} falhou:`, (e as Error).message);
    return {};
  }
}
