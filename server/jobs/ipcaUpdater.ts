import cron from 'node-cron';
import { refreshAllIPCA } from '../services/ipcaRefresh.js';

let running = false;

async function run(label: string) {
  if (running) {
    console.log(`[Cron] ${label} — já em execução, pulando.`);
    return;
  }
  running = true;
  console.log(`[Cron] ${label} — iniciando atualização IPCA…`);
  try {
    const result = await refreshAllIPCA();
    console.log(
      `[Cron] ${label} — concluído. Nacional: ${result.national} | ` +
      `Regional: ${Object.values(result.regional).reduce((a, b) => a + b, 0)} | ` +
      `Erros: ${result.errors.length}`,
    );
    if (result.errors.length > 0) {
      console.warn('[Cron] Erros:', result.errors.join('; '));
    }
  } catch (e) {
    console.error('[Cron] Falha inesperada:', e);
  } finally {
    running = false;
  }
}

export function startScheduler() {
  // 05:00 BRT (America/Sao_Paulo)
  cron.schedule('0 5 * * *', () => run('05:00 BRT'), {
    timezone: 'America/Sao_Paulo',
  });

  // 23:00 BRT (America/Sao_Paulo)
  cron.schedule('0 23 * * *', () => run('23:00 BRT'), {
    timezone: 'America/Sao_Paulo',
  });

  console.log('[Cron] Scheduler iniciado — atualizações às 05:00 e 23:00 BRT.');
}
