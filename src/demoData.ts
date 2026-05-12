import { Transaction, IPCACategory } from './types';

/* ─── Utilitário ──────────────────────────────────────────────
   rep(v, n) → array com n cópias de v
   ─────────────────────────────────────────────────────────── */
function rep<T>(v: T, n: number): T[] { return Array(n).fill(v); }

/* ─── 27 meses: Jan/2024 → Mar/2026 ─────────────────────────
   Índice 0 = Jan/2024 … índice 26 = Mar/2026
   ─────────────────────────────────────────────────────────── */
const MONTHS: string[] = (() => {
  const m: string[] = [];
  for (let y = 2024; y <= 2026; y++)
    for (let mo = 1; mo <= (y === 2026 ? 3 : 12); mo++)
      m.push(`${y}-${String(mo).padStart(2, '0')}`);
  return m; // 27 entradas
})();

/* ═══════════════════════════════════════════════════════════
   CENÁRIO A — Inflação ACIMA do IPCA
   Perfil: casal com filhos, alta concentração em alimentação,
           educação e saúde — setores com inflação acima da média.
   Inflação pessoal acumulada ≈ 14,8 %
   IPCA oficial Jan/24 → Mar/26 ≈ 11,4 %
   ═══════════════════════════════════════════════════════════ */

//                          [Jan/24–Jun/24] [Jul/24–Dez/24] [Jan/25–Jun/25] [Jul/25–Mar/26]
const A_alimentacao  = [...rep(2800, 6), ...rep(2940, 6), ...rep(3080, 6), ...rep(3280, 9)];
//                          [Jan/24–Mar/24] [Abr/24–Mar/25]  [Abr/25–Mar/26]
const A_moradia      = [...rep(3200, 3), ...rep(3360, 12), ...rep(3570, 12)]; // +5% abr/24, +6% abr/25
//                          [Jan/24–Dez/24] [Jan/25–Dez/25]  [Jan/26–Mar/26]
const A_educacao     = [...rep(1800, 12), ...rep(1980, 12), ...rep(2196, 3)]; // +10% jan/25, +10,9% jan/26
//                          [Jan/24–Abr/24] [Mai/24–Abr/25]  [Mai/25–Mar/26]
const A_saude        = [...rep(800, 4),  ...rep(840, 12), ...rep(924, 11)];   // +5% mai/24, +10% mai/25
const A_transportes  = [...rep(600, 6),  ...rep(615, 6),  ...rep(628, 6),  ...rep(648, 9)];
const A_vestuario    = [...rep(300, 6),  ...rep(315, 6),  ...rep(322, 6),  ...rep(336, 9)];
const A_despesas     = [...rep(400, 6),  ...rep(415, 6),  ...rep(428, 6),  ...rep(440, 9)];
//                          [Jan/24–Dez/24] [Jan/25–Set/25]  [Out/25–Mar/26]
const A_artigos      = [...rep(200, 12), ...rep(208, 9),  ...rep(216, 6)];
const A_comunicacao  = [...rep(150, 12), ...rep(154, 9),  ...rep(157, 6)];
//                          [Jan/24–Fev/25] 14 meses  [Mar/25–Mar/26] 13 meses
const A_income       = [...rep(14000, 14), ...rep(15000, 13)];

/* ═══════════════════════════════════════════════════════════
   CENÁRIO B — Inflação ABAIXO do IPCA
   Perfil: jovem profissional solteiro, gastos controlados,
           alto peso em moradia (aluguel negociado) e comunicação
           (setor com preços estáveis), baixo peso em serviços
           de alta inflação.
   Inflação pessoal acumulada ≈ 6,4 %
   IPCA oficial Jan/24 → Mar/26 ≈ 11,4 %
   ═══════════════════════════════════════════════════════════ */

const B_alimentacao  = [...rep(900, 6),  ...rep(920, 6),  ...rep(942, 6),  ...rep(972, 9)];
const B_moradia      = [...rep(1800, 3), ...rep(1854, 12), ...rep(1908, 12)]; // +3% abr/24, +2,9% abr/25
const B_educacao     = [...rep(400, 12), ...rep(432, 12), ...rep(448, 3)];    // cursos online +8% jan/25
const B_saude        = [...rep(250, 4),  ...rep(263, 12), ...rep(275, 11)];
const B_transportes  = [...rep(320, 6),  ...rep(326, 6),  ...rep(331, 6),  ...rep(336, 9)]; // transp. público
const B_vestuario    = [...rep(200, 6),  ...rep(206, 6),  ...rep(210, 6),  ...rep(214, 9)];
const B_despesas     = [...rep(550, 6),  ...rep(558, 6),  ...rep(565, 6),  ...rep(572, 9)];
const B_artigos      = [...rep(280, 12), ...rep(284, 9),  ...rep(288, 6)];
const B_comunicacao  = [...rep(350, 12), ...rep(355, 9),  ...rep(360, 6)]; // telecomunicações: inflação baixa
const B_income       = [...rep(6500, 14), ...rep(7000, 13)];

/* ─── Gerador de transações ──────────────────────────────── */
function r(n: number) { return Math.round(n * 100) / 100; }

interface Scenario {
  income:       number[];
  alimentacao:  number[];
  moradia:      number[];
  educacao:     number[];
  saude:        number[];
  transportes:  number[];
  vestuario:    number[];
  despesas:     number[];
  artigos:      number[];
  comunicacao:  number[];
}

function buildDemo(
  data: Scenario,
  prefix: string,
  incomeDesc: string,
): Transaction[] {
  const txs: Transaction[] = [];
  let seq = 1;

  function add(
    ym: string,
    day: number,
    desc: string,
    cat: IPCACategory,
    type: 'expense' | 'income',
    amount: number,
  ) {
    txs.push({
      id: `${prefix}-${String(seq++).padStart(4, '0')}`,
      date: `${ym}-${String(day).padStart(2, '0')}`,
      description: desc,
      category: cat,
      type,
      amount: r(amount),
    });
  }

  for (let i = 0; i < MONTHS.length; i++) {
    const ym = MONTHS[i];
    const mes = parseInt(ym.split('-')[1]);

    const al = data.alimentacao[i];
    const mv = data.moradia[i];
    const ed = data.educacao[i];
    const sa = data.saude[i];
    const tr = data.transportes[i];
    const ve = data.vestuario[i];
    const dp = data.despesas[i];
    const ar = data.artigos[i];
    const co = data.comunicacao[i];

    /* Renda */
    add(ym, 5, incomeDesc, 'despesas_pessoais', 'income', data.income[i]);

    /* Alimentação e Bebidas (3 lançamentos) */
    add(ym,  7, 'Supermercado',          'alimentacao_bebidas', 'expense', r(al * 0.60));
    add(ym, 18, 'Feira e mercadinho',    'alimentacao_bebidas', 'expense', r(al * 0.25));
    add(ym, 25, 'Alimentação fora',      'alimentacao_bebidas', 'expense', r(al * 0.15));

    /* Moradia (3 lançamentos) */
    add(ym,  5, 'Aluguel',                         'moradia', 'expense', r(mv * 0.75));
    add(ym, 10, 'Condomínio e energia elétrica',   'moradia', 'expense', r(mv * 0.20));
    add(ym, 15, 'Conta de gás',                    'moradia', 'expense', r(mv * 0.05));

    /* Educação (2 lançamentos) */
    add(ym,  5, 'Mensalidade',                                    'educacao', 'expense', r(ed * 0.88));
    add(ym, 20, mes <= 2 ? 'Material didático e livros' : 'Materiais e taxas',
                                                                  'educacao', 'expense', r(ed * 0.12));

    /* Saúde e Cuidados Pessoais (2 lançamentos) */
    add(ym,  8, 'Plano de saúde',       'saude_cuidados', 'expense', r(sa * 0.70));
    add(ym, 20, 'Farmácia e cuidados',  'saude_cuidados', 'expense', r(sa * 0.30));

    /* Transportes (2 lançamentos) */
    add(ym, 12, 'Combustível / transporte público', 'transportes', 'expense', r(tr * 0.65));
    add(ym, 25, 'Estacionamento e pedágio',         'transportes', 'expense', r(tr * 0.35));

    /* Vestuário (1 lançamento) */
    add(ym, 15, 'Roupas e calçados', 'vestuario', 'expense', ve);

    /* Despesas Pessoais (2 lançamentos) */
    add(ym, 18, 'Lazer e entretenimento', 'despesas_pessoais', 'expense', r(dp * 0.55));
    add(ym, 28, 'Serviços pessoais',      'despesas_pessoais', 'expense', r(dp * 0.45));

    /* Artigos de Residência (1 lançamento) */
    add(ym, 22, 'Itens domésticos', 'artigos_residencia', 'expense', ar);

    /* Comunicação (3 lançamentos) */
    add(ym, 10, 'Internet banda larga', 'comunicacao', 'expense', r(co * 0.45));
    add(ym, 10, 'Plano de celular',     'comunicacao', 'expense', r(co * 0.35));
    add(ym, 15, 'Streaming',            'comunicacao', 'expense', r(co * 0.20));
  }

  return txs;
}

/* ─── Exportações ────────────────────────────────────────── */

/**
 * Demo A — Inflação pessoal ACIMA do IPCA (~14,8 %)
 * Casal com filhos, alto gasto em alimentação, educação e saúde.
 * Período: Jan/2024 → Mar/2026 | Renda: R$ 14 k → R$ 15 k
 */
export const DEMO_TRANSACTIONS_ABOVE: Transaction[] = buildDemo(
  {
    income: A_income, alimentacao: A_alimentacao, moradia: A_moradia,
    educacao: A_educacao, saude: A_saude, transportes: A_transportes,
    vestuario: A_vestuario, despesas: A_despesas,
    artigos: A_artigos, comunicacao: A_comunicacao,
  },
  'dma',
  'Salário — Ana e Pedro',
);

/**
 * Demo B — Inflação pessoal ABAIXO do IPCA (~6,4 %)
 * Jovem profissional solteiro, gastos controlados, alto peso em
 * moradia (aluguel estável) e comunicação (preços estáveis).
 * Período: Jan/2024 → Mar/2026 | Renda: R$ 6,5 k → R$ 7 k
 */
export const DEMO_TRANSACTIONS_BELOW: Transaction[] = buildDemo(
  {
    income: B_income, alimentacao: B_alimentacao, moradia: B_moradia,
    educacao: B_educacao, saude: B_saude, transportes: B_transportes,
    vestuario: B_vestuario, despesas: B_despesas,
    artigos: B_artigos, comunicacao: B_comunicacao,
  },
  'dmb',
  'Salário — Lucas',
);

// Alias legado (usado por código ainda não migrado)
export const DEMO_TRANSACTIONS = DEMO_TRANSACTIONS_ABOVE;
