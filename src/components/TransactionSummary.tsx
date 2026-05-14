import { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Transaction, IPCACategory } from '../types';
import { CATEGORIES, MONTH_NAMES_SHORT } from '../constants';
import { formatBRL } from '../formatters';

interface Props {
  transactions: Transaction[];
}

/* ── helpers ───────────────────────────────────────────────── */
function fmt(v: number) {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
}

function ymToLabel(ym: string) {
  const [y, m] = ym.split('-');
  return `${MONTH_NAMES_SHORT[parseInt(m) - 1]}/${y.slice(2)}`;
}

/* ── custom tooltips ───────────────────────────────────────── */
function PieTooltipContent({ active, payload }: { active?: boolean; payload?: { payload: { label: string; value: number; pct: number; color: string } }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl px-3 py-2 text-xs"
      style={{ background: 'rgba(8,8,8,0.96)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <p className="font-semibold mb-0.5" style={{ color: d.color }}>{d.label}</p>
      <p style={{ color: 'var(--text-2)' }}>{formatBRL(d.value)}</p>
      <p style={{ color: 'var(--text-3)' }}>{d.pct.toFixed(1)}% do total</p>
    </div>
  );
}

function LineTooltipContent({ active, payload, label, color }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  color: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs"
      style={{ background: 'rgba(8,8,8,0.96)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <p className="font-semibold text-slate-200 mb-1">{label}</p>
      <p className="font-semibold" style={{ color }}>{formatBRL(payload[0].value)}</p>
    </div>
  );
}

/* ── componente principal ──────────────────────────────────── */
export default function TransactionSummary({ transactions }: Props) {
  const expenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense'),
    [transactions],
  );

  /* totais por categoria */
  const categoryTotals = useMemo(() => {
    const totals: Partial<Record<IPCACategory, number>> = {};
    for (const t of expenses) {
      totals[t.category] = (totals[t.category] ?? 0) + t.amount;
    }
    return totals;
  }, [expenses]);

  const totalExpense = useMemo(
    () => Object.values(categoryTotals).reduce((s, v) => s + v, 0),
    [categoryTotals],
  );

  /* dados do pie — ordenados por valor desc */
  const pieData = useMemo(
    () =>
      (Object.entries(categoryTotals) as [IPCACategory, number][])
        .sort((a, b) => b[1] - a[1])
        .map(([cat, total]) => ({
          category:  cat,
          label:     CATEGORIES[cat].label,
          emoji:     CATEGORIES[cat].emoji,
          value:     total,
          pct:       totalExpense > 0 ? (total / totalExpense) * 100 : 0,
          color:     CATEGORIES[cat].color,
        })),
    [categoryTotals, totalExpense],
  );

  const [selectedCat, setSelectedCat] = useState<IPCACategory | null>(null);
  const activeCat = selectedCat ?? (pieData[0]?.category ?? null);
  const activeMeta = activeCat ? CATEGORIES[activeCat] : null;
  const activeTotal = activeCat ? (categoryTotals[activeCat] ?? 0) : 0;
  const activePct = totalExpense > 0 ? ((activeTotal / totalExpense) * 100).toFixed(1) : null;

  /* histórico mensal da categoria selecionada */
  const lineData = useMemo(() => {
    if (!activeCat) return [];
    const byMonth: Record<string, number> = {};
    for (const t of expenses) {
      if (t.category !== activeCat) continue;
      const ym = t.date.substring(0, 7);
      byMonth[ym] = (byMonth[ym] ?? 0) + t.amount;
    }
    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ym, amount]) => ({ ym, label: ymToLabel(ym), amount }));
  }, [expenses, activeCat]);

  if (expenses.length === 0) return null;

  const tickInterval = Math.max(1, Math.floor(lineData.length / 6));

  return (
    <div className="card p-5 space-y-5">
      {/* header */}
      <div>
        <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>
          Resumo de Movimentações
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
          Distribuição por grupo IPCA e histórico mensal de gastos — clique numa fatia ou grupo para detalhar
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ── Coluna esquerda: pizza ───────────────────────── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
            Participação por Grupo
          </p>

          <div className="flex gap-4 items-center">
            {/* donut */}
            <div className="shrink-0" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={46} outerRadius={74}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={(d) => setSelectedCat(d.category as IPCACategory)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={entry.color}
                        opacity={activeCat === entry.category ? 1 : 0.35}
                        stroke={activeCat === entry.category ? entry.color : 'transparent'}
                        strokeWidth={activeCat === entry.category ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* legenda clicável */}
            <div className="flex-1 min-w-0 space-y-1 overflow-y-auto" style={{ maxHeight: 160 }}>
              {pieData.map((d) => {
                const isActive = activeCat === d.category;
                return (
                  <button
                    key={d.category}
                    onClick={() => setSelectedCat(d.category)}
                    className="flex items-center gap-2 w-full text-left rounded-lg px-2 py-1.5 transition-all duration-100"
                    style={{
                      background: isActive ? `${d.color}18` : 'transparent',
                      border: `1px solid ${isActive ? `${d.color}30` : 'transparent'}`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: d.color, opacity: isActive ? 1 : 0.45 }}
                    />
                    <span
                      className="text-[11px] truncate flex-1"
                      style={{ color: isActive ? 'var(--text-1)' : 'var(--text-3)' }}
                    >
                      {d.label}
                    </span>
                    <span
                      className="text-[11px] font-bold shrink-0 tabular-nums"
                      style={{ color: isActive ? d.color : 'var(--text-3)' }}
                    >
                      {d.pct.toFixed(1)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Coluna direita: linha ─────────────────────────── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-3)' }}>
            Histórico Mensal — {activeMeta?.label ?? '—'}
          </p>

          {/* callout de participação */}
          {activeMeta && activePct && (
            <div
              className="rounded-xl px-4 py-2.5 mb-3 flex items-center gap-2 text-xs"
              style={{
                background: `${activeMeta.color}10`,
                border: `1px solid ${activeMeta.color}28`,
              }}
            >
              <span className="text-sm shrink-0">{activeMeta.emoji}</span>
              <p style={{ color: 'var(--text-2)' }}>
                <span className="font-semibold" style={{ color: activeMeta.color }}>
                  {activeMeta.label}
                </span>
                {' '}representou{' '}
                <span className="font-bold" style={{ color: 'var(--text-1)' }}>
                  {activePct}%
                </span>
                {' '}de todos os seus gastos
                {' · '}
                <span className="font-semibold" style={{ color: 'var(--text-1)' }}>
                  {formatBRL(activeTotal)}
                </span>
                {' '}no total
              </p>
            </div>
          )}

          {/* gráfico de linha */}
          {lineData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={155}>
              <LineChart data={lineData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: 'var(--text-3)' }}
                  axisLine={false}
                  tickLine={false}
                  interval={tickInterval}
                />
                <YAxis
                  tickFormatter={fmt}
                  tick={{ fontSize: 10, fill: 'var(--text-3)' }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  domain={([min, max]: [number, number]) => {
                    const pad = (max - min) * 0.15 || max * 0.1;
                    return [Math.max(0, Math.floor(min - pad)), Math.ceil(max + pad)];
                  }}
                />
                <Tooltip
                  content={(props) => (
                    <LineTooltipContent
                      {...props}
                      color={activeMeta?.color ?? '#F97316'}
                    />
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={activeMeta?.color ?? '#F97316'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: activeMeta?.color ?? '#F97316', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div
              className="h-36 flex items-center justify-center rounded-xl text-xs"
              style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-3)' }}
            >
              Dados insuficientes — registre gastos em ao menos 2 meses
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
