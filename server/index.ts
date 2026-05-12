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
  /* Validação da DATABASE_URL ─────────────────────────────
   * Railway: adicione a variável de referência no painel do serviço:
   *   Nome:  DATABASE_URL
   *   Valor: ${{Postgres.DATABASE_URL}}
   * ─────────────────────────────────────────────────────── */
  if (!process.env.DATABASE_URL) {
    console.error(`
╔══════════════════════════════════════════════════════════════╗
║  DATABASE_URL não encontrada — servidor não pode iniciar.   ║
║                                                              ║
║  No Railway, acesse o serviço da app → aba Variables e      ║
║  adicione a variável de referência:                         ║
║    Nome:  DATABASE_URL                                       ║
║    Valor: \${{Postgres.DATABASE_URL}}                        ║
║                                                              ║
║  Depois clique em "Deploy" para reiniciar.                  ║
╚══════════════════════════════════════════════════════════════╝
    `.trim());
    // Aguarda 10 s antes de sair para evitar loop de restart acelerado
    await new Promise((r) => setTimeout(r, 10_000));
    process.exit(1);
  }

  /* Conexão com o banco ────────────────────────────────── */
  let dbReady = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await initDB();
      dbReady = true;
      break;
    } catch (e) {
      console.error(`[DB] Tentativa ${attempt}/5 falhou:`, (e as Error).message);
      if (attempt < 5) await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }

  if (!dbReady) {
    console.error('[Server] ❌ Não foi possível conectar ao banco após 5 tentativas. Encerrando.');
    process.exit(1);
  }

  startScheduler();

  app.listen(PORT, () => {
    console.log(`[Server] ✅ Rodando na porta ${PORT}`);
  });
}

bootstrap();
