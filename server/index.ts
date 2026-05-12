import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db.js';
import transactionsRouter from './routes/transactions.js';
import ipcaRouter from './routes/ipca.js';
import { startScheduler } from './jobs/ipcaUpdater.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

/* ── Middleware ──────────────────────────────────────────── */
app.use(express.json({ limit: '2mb' }));

/* ── API routes ─────────────────────────────────────────── */
app.use('/api/transactions', transactionsRouter);
app.use('/api/ipca', ipcaRouter);

/* ── Health check ───────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

/* ── Serve React SPA (production) ───────────────────────── */
const distDir = path.join(__dirname, '../dist');
app.use(express.static(distDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

/* ── Bootstrap ──────────────────────────────────────────── */
async function bootstrap() {
  if (!process.env.DATABASE_URL) {
    console.error('[Server] ❌ DATABASE_URL não configurada. Configure o PostgreSQL no Railway.');
    process.exit(1);
  }

  try {
    await initDB();
  } catch (e) {
    console.error('[Server] ❌ Falha ao inicializar banco de dados:', e);
    process.exit(1);
  }

  startScheduler();

  app.listen(PORT, () => {
    console.log(`[Server] ✅ Rodando na porta ${PORT}`);
  });
}

bootstrap();
