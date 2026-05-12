import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, isRegionalEmpty } from './db.js';
import transactionsRouter from './routes/transactions.js';
import ipcaRouter from './routes/ipca.js';
import { startScheduler } from './jobs/ipcaUpdater.js';
import { refreshAllIPCA } from './services/ipcaRefresh.js';

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

  /* Seed inicial do IPCA regional ─────────────────────────
   * A tabela ipca_national é populada pelo FALLBACK_IPCA no initDB.
   * A tabela ipca_regional começa vazia — se estiver vazia, dispara
   * um fetch completo em background (não bloqueia a subida do servidor).
   * O cron das 05:00 e 23:00 BRT mantém os dados atualizados depois.
   * ─────────────────────────────────────────────────────── */
  try {
    const needsSeed = await isRegionalEmpty();
    if (needsSeed) {
      console.log('[Server] IPCA regional vazio — iniciando fetch inicial do IBGE em background…');
      setTimeout(() => {
        refreshAllIPCA()
          .then((r) => console.log(
            `[Server] Seed inicial concluído — nacional: ${r.national}, ` +
            `regional: ${Object.values(r.regional).reduce((a, b) => a + b, 0)} períodos.`,
          ))
          .catch((e) => console.error('[Server] Erro no seed inicial regional:', e));
      }, 5_000); // aguarda 5 s para o servidor estar pronto antes de iniciar
    } else {
      console.log('[Server] IPCA regional já populado no banco.');
    }
  } catch (e) {
    console.warn('[Server] Não foi possível verificar seed regional:', (e as Error).message);
  }

  startScheduler();

  app.listen(PORT, () => {
    console.log(`[Server] ✅ Rodando na porta ${PORT}`);
  });
}

bootstrap();
