import { Router } from 'express';
import pool from '../db.js';
import { FALLBACK_IPCA } from '../../src/constants.js';
import { refreshAllIPCA } from '../services/ipcaRefresh.js';

const router = Router();

/* GET /api/ipca/national?start=202201&end=202612 */
router.get('/national', async (req, res) => {
  const start = (req.query.start as string) || '202201';
  const end   = (req.query.end   as string) || '202612';
  try {
    const { rows } = await pool.query<{ period: string; value: string }>(
      `SELECT period, value::float AS value
       FROM ipca_national
       WHERE period >= $1 AND period <= $2
       ORDER BY period`,
      [start, end],
    );
    if (rows.length === 0) {
      // Tabela vazia — devolve fallback para o frontend não ficar em branco
      return res.json(FALLBACK_IPCA);
    }
    const result: Record<string, number> = {};
    for (const row of rows) result[row.period] = parseFloat(row.value);
    return res.json(result);
  } catch (e) {
    console.error('[API] GET /ipca/national:', e);
    return res.json(FALLBACK_IPCA);
  }
});

/* GET /api/ipca/regional/:ibgeCode?start=202201&end=202612 */
router.get('/regional/:ibgeCode', async (req, res) => {
  const { ibgeCode } = req.params;
  const start = (req.query.start as string) || '202201';
  const end   = (req.query.end   as string) || '202612';
  try {
    const { rows } = await pool.query<{ period: string; value: string }>(
      `SELECT period, value::float AS value
       FROM ipca_regional
       WHERE region_code = $1 AND period >= $2 AND period <= $3
       ORDER BY period`,
      [ibgeCode, start, end],
    );
    const result: Record<string, number> = {};
    for (const row of rows) result[row.period] = parseFloat(row.value);
    return res.json(result); // {} se sem dados → App faz fallback para nacional
  } catch (e) {
    console.error('[API] GET /ipca/regional:', e);
    return res.json({});
  }
});

/* POST /api/ipca/refresh — atualização manual (ex: admin) */
router.post('/refresh', async (_req, res) => {
  try {
    res.json({ ok: true, message: 'Atualização iniciada em background.' });
    // Fire-and-forget após enviar resposta
    refreshAllIPCA().catch((e) => console.error('[API] refresh error:', e));
  } catch (e) {
    console.error('[API] POST /ipca/refresh:', e);
    res.status(500).json({ error: 'Erro ao iniciar atualização.' });
  }
});

/* GET /api/ipca/status — última atualização */
router.get('/status', async (_req, res) => {
  try {
    const nat = await pool.query<{ count: string; last: string }>(
      `SELECT COUNT(*) AS count, MAX(updated_at) AS last FROM ipca_national`,
    );
    const reg = await pool.query<{ count: string; last: string }>(
      `SELECT COUNT(*) AS count, MAX(updated_at) AS last FROM ipca_regional`,
    );
    res.json({
      national: {
        periods: parseInt(nat.rows[0].count, 10),
        lastUpdated: nat.rows[0].last,
      },
      regional: {
        rows: parseInt(reg.rows[0].count, 10),
        lastUpdated: reg.rows[0].last,
      },
    });
  } catch (e) {
    console.error('[API] GET /ipca/status:', e);
    res.status(500).json({ error: 'Erro ao buscar status.' });
  }
});

export default router;
