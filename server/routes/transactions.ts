import { Router } from 'express';
import pool from '../db.js';
import type { Transaction } from '../../src/types.js';

const router = Router();

/* GET /api/transactions */
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query<Transaction & { created_at: string }>(
      'SELECT id, date, description, category, type, amount::float AS amount FROM transactions ORDER BY date, created_at',
    );
    res.json(rows);
  } catch (e) {
    console.error('[API] GET /transactions:', e);
    res.status(500).json({ error: 'Erro ao buscar transações.' });
  }
});

/* POST /api/transactions  — adiciona uma transação */
router.post('/', async (req, res) => {
  const { id, date, description, category, type, amount } = req.body as Transaction;
  if (!id || !date || !description || !category || !type || amount == null) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }
  try {
    await pool.query(
      `INSERT INTO transactions (id, date, description, category, type, amount)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [id, date, description, category, type, amount],
    );
    return res.json({ ok: true });
  } catch (e) {
    console.error('[API] POST /transactions:', e);
    return res.status(500).json({ error: 'Erro ao salvar transação.' });
  }
});

/* POST /api/transactions/demo — apaga tudo e carrega dataset demo */
router.post('/demo', async (req, res) => {
  const { transactions } = req.body as { transactions: Transaction[] };
  if (!Array.isArray(transactions)) {
    return res.status(400).json({ error: 'Body deve ter campo transactions[].' });
  }
  try {
    await pool.query('DELETE FROM transactions');
    for (const t of transactions) {
      await pool.query(
        `INSERT INTO transactions (id, date, description, category, type, amount)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [t.id, t.date, t.description, t.category, t.type, t.amount],
      );
    }
    return res.json({ ok: true, count: transactions.length });
  } catch (e) {
    console.error('[API] POST /transactions/demo:', e);
    return res.status(500).json({ error: 'Erro ao carregar demo.' });
  }
});

/* DELETE /api/transactions/:id — apaga uma transação */
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (e) {
    console.error('[API] DELETE /transactions/:id:', e);
    res.status(500).json({ error: 'Erro ao deletar transação.' });
  }
});

/* DELETE /api/transactions — apaga todas */
router.delete('/', async (_req, res) => {
  try {
    await pool.query('DELETE FROM transactions');
    res.json({ ok: true });
  } catch (e) {
    console.error('[API] DELETE /transactions:', e);
    res.status(500).json({ error: 'Erro ao limpar transações.' });
  }
});

export default router;
