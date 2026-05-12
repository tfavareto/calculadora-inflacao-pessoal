import pg from 'pg';
import { FALLBACK_IPCA } from '../src/constants.js';
import { REGIONS } from '../src/regions.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway')
    ? { rejectUnauthorized: false }
    : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;

/* ─── Schema ─────────────────────────────────────────────── */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT        PRIMARY KEY,
  date        TEXT        NOT NULL,
  description TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  type        TEXT        NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ipca_national (
  period     CHAR(6)      PRIMARY KEY,
  value      NUMERIC(8,4) NOT NULL,
  updated_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ipca_regional (
  period      CHAR(6)      NOT NULL,
  region_code TEXT         NOT NULL,
  value       NUMERIC(8,4) NOT NULL,
  updated_at  TIMESTAMPTZ  DEFAULT NOW(),
  PRIMARY KEY (period, region_code)
);
`;

/* ─── Seed FALLBACK_IPCA when national table is empty ─────── */
async function seedNationalIfEmpty(client: pg.PoolClient) {
  const { rows } = await client.query('SELECT COUNT(*) FROM ipca_national');
  if (parseInt(rows[0].count, 10) > 0) return;

  console.log('[DB] Seeding national IPCA from FALLBACK_IPCA…');
  for (const [period, value] of Object.entries(FALLBACK_IPCA)) {
    await client.query(
      `INSERT INTO ipca_national (period, value)
       VALUES ($1, $2) ON CONFLICT (period) DO NOTHING`,
      [period, value],
    );
  }
  console.log(`[DB] Seeded ${Object.keys(FALLBACK_IPCA).length} national IPCA entries.`);
}

/* ─── Init: create tables + seed ─────────────────────────── */
export async function initDB(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA);
    await seedNationalIfEmpty(client);
    console.log('[DB] Schema ready.');
  } finally {
    client.release();
  }
}

/* ─── Helper to upsert a batch of IPCA values ─────────────── */
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

/* ─── Log update run ──────────────────────────────────────── */
export async function getRegionList() {
  return REGIONS;
}
