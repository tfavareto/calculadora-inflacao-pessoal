/**
 * Refreshes IPCA data in the database.
 * Called by the cron scheduler and by the manual /api/ipca/refresh endpoint.
 */
import { upsertNational, upsertRegional, getRegionList } from '../db.js';
import { fetchNationalIPCA, fetchRegionalIPCA } from './ibgeService.js';

const START = '202201';
const END   = '202612'; // keep fetching ahead — IBGE only returns available periods

export async function refreshAllIPCA(): Promise<{
  national: number;
  regional: Record<string, number>;
  errors: string[];
}> {
  const errors: string[] = [];
  let national = 0;

  /* ── Nacional ──────────────────────────────────────────── */
  try {
    const data = await fetchNationalIPCA(START, END);
    if (Object.keys(data).length > 0) {
      national = await upsertNational(data);
      console.log(`[Refresh] Nacional: ${national} períodos atualizados.`);
    } else {
      const msg = 'Nacional: IBGE não retornou dados, DB mantém valores anteriores.';
      console.warn(`[Refresh] ${msg}`);
      errors.push(msg);
    }
  } catch (e) {
    const msg = `Nacional: ${(e as Error).message}`;
    console.error('[Refresh]', msg);
    errors.push(msg);
  }

  /* ── Regional (10 regiões) ─────────────────────────────── */
  const regions = await getRegionList();
  const regional: Record<string, number> = {};

  for (const region of regions) {
    try {
      const data = await fetchRegionalIPCA(region.n7Code, START, END);
      if (Object.keys(data).length > 0) {
        const count = await upsertRegional(region.ibgeCode, data);
        regional[region.city] = count;
        console.log(`[Refresh] ${region.city}: ${count} períodos atualizados.`);
      } else {
        const msg = `${region.city}: sem dados no IBGE.`;
        console.warn(`[Refresh] ${msg}`);
        errors.push(msg);
        regional[region.city] = 0;
      }
      // Throttle — be polite to the IBGE API
      await new Promise((r) => setTimeout(r, 400));
    } catch (e) {
      const msg = `${region.city}: ${(e as Error).message}`;
      console.error('[Refresh]', msg);
      errors.push(msg);
      regional[region.city] = 0;
    }
  }

  return { national, regional, errors };
}
