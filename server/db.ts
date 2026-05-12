import pg from 'pg';
import { FALLBACK_IPCA } from '../src/constants.js';
import { REGIONS } from '../src/regions.js';

const { Pool } = pg;

/**
 * SSL: Railway usa certificados auto-assinados em ambos os modos
 * (private networking e URL pública). rejectUnauthorized: false cobre
 * os dois casos. Em dev local sem SSL (localhost), a conexão também
 * funciona — pg ignora a config SSL se o servidor não a exigir.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL: ativo para qualquer URL remota (Railway, Supabase, etc.)
  // Desligado apenas para conexões locais (localhost / 127.0.0.1)
  ssl: (() => {
    const url = process.env.DATABASE_URL ?? '';
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
    return isLocal ? undefined : { rejectUnauthorized: false };
  })(),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
});

export default pool;

/* ─── Schema ─────────────────────────────────────────────── */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT          PRIMARY KEY,
  date        TEXT          NOT NULL,
  description TEXT          NOT NULL,
  category    TEXT          NOT NULL,
  type        TEXT          NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  created_at  TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ipca_national (
  period     CHAR(6)       PRIMARY KEY,
  value      NUMERIC(8,4)  NOT NULL,
  updated_at TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ipca_regional (
  period      CHAR(6)       NOT NULL,
  region_code TEXT          NOT NULL,
  value       NUMERIC(8,4)  NOT NULL,
  updated_at  TIMESTAMPTZ   DEFAULT NOW(),
  PRIMARY KEY (period, region_code)
);
`;

/* ─── Seed FALLBACK_IPCA quando a tabela nacional está vazia ─ */
async function seedNationalIfEmpty(client: pg.PoolClient) {
  const { rows } = await client.query('SELECT COUNT(*) FROM ipca_national');
  if (parseInt(rows[0].count, 10) > 0) return;

  console.log('[DB] Populando IPCA nacional com FALLBACK_IPCA…');
  for (const [period, value] of Object.entries(FALLBACK_IPCA)) {
    await client.query(
      `INSERT INTO ipca_national (period, value)
       VALUES ($1, $2) ON CONFLICT (period) DO NOTHING`,
      [period, value],
    );
  }
  console.log(`[DB] ${Object.keys(FALLBACK_IPCA).length} períodos do IPCA nacional inseridos.`);
}

/* ─── Init: cria tabelas + seed ───────────────────────────── */
export async function initDB(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA);
    await seedNationalIfEmpty(client);
    console.log('[DB] Schema pronto.');
  } finally {
    client.release();
  }
}

/* ─── Upsert em lote — IPCA nacional ──────────────────────── */
export async function upsertNational(data: Record<string, number>): Promise<number> {
  if (Object.keys(data).length === 0) return 0;
  const client = await pool.connect();
  try {
    let count = 0;
    for (const [period, value] of Object.entries(data)) {
      await client.query(
        `INSERT INTO ipca_national (period, value, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (period) DO UPDATE
           SET value = EXCLUDED.value, updated_at = NOW()`,
        [period, value],
      );
      count++;
    }
    return count;
  } finally {
    client.release();
  }
}

/* ─── Upsert em lote — IPCA regional ──────────────────────── */
export async function upsertRegional(
  regionCode: string,
  data: Record<string, number>,
): Promise<number> {
  if (Object.keys(data).length === 0) return 0;
  const client = await pool.connect();
  try {
    let count = 0;
    for (const [period, value] of Object.entries(data)) {
      await client.query(
        `INSERT INTO ipca_regional (period, region_code, value, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (period, region_code) DO UPDATE
           SET value = EXCLUDED.value, updated_at = NOW()`,
        [period, regionCode, value],
      );
      count++;
    }
    return count;
  } finally {
    client.release();
  }
}

/* ─── Verifica se a tabela regional precisa de seed ──────── */
export async function isRegionalEmpty(): Promise<boolean> {
  const { rows } = await pool.query('SELECT COUNT(*) FROM ipca_regional');
  return parseInt(rows[0].count, 10) === 0;
}

export function getRegionList() {
  return REGIONS;
}
