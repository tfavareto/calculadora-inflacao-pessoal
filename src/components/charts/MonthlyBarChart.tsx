import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';
import { InflationPoint } from '../../types';
import { formatPct } from '../../formatters';

interface Props { data: InflationPoint[]; ipcaLabel?: string }

const makeSeries = (ipcaLabel: string) => [
  { key: 'personalMonthly', label: 'Minha Inflação', colorPos: '#8B5CF6', colorNeg: '#C4B5FD' },
  { key: 'ipcaMonthly',     label: ipcaLabel,        colorPos: '#06B6D4', colorNeg: '#67E8F9' },
] as const;

type SeriesKey = typeof SERIES[number]['key'];

function CustomTooltip({ active, payload, label, hidden }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
  hidden: Set<SeriesKey>;
}) {
  if (!active || !payload?.length) return null;
  const visible = payload.filter((p) => !hidden.has(p.dataKey as SeriesKey));
  if (!visible.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm backdrop-blur-md"
      style={{
        background: 'rgba(12, 10, 26, 0.94)',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p className="font-semibold text-slate-200 mb-2">{label}</p>
      {visible.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-2)' }} className="text-xs">{p.name}:</span>
          <span className="font-semibold text-xs" style={{ color: p.color }}>
            {formatPct(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({
  hidden,
  onToggle,
}: {
  hidden: Set<SeriesKey>;
  onToggle: (key: SeriesKey) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-5 pt-4">
      {SERIES.map((s) => {
        const isHidden = hidden.has(s.key);
        return (
          <button
            key={s.key}
            onClick={() => onToggle(s.key)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-all duration-150"
            style={{
              opacity: isHidden ? 0.4 : 1,
              background: isHidden ? 'transparent' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isHidden ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              cursor: 'pointer',
            }}
            title={isHidden ? `Exibir ${s.label}` : `Ocultar ${s.label}`}
          >
            <span
              className="w-3 h-3 rounded-sm shrink-0 transition-all duration-150"
              style={{ background: isHidden ? 'rgba(255,255,255,0.2)' : s.colorPos }}
            />
            <span
              className="text-xs font-medium select-none"
              style={{ color: isHidden ? 'var(--text-3)' : 'var(--text-2)' }}
            >
              {s.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function MonthlyBarChart({ data, ipcaLabel = 'IPCA Oficial' }: Props) {
  const SERIES = makeSeries(ipcaLabel);
  const chartData = data.slice(1);
  const [hidden, setHidden] = useState<Set<SeriesKey>>(new Set());

  function toggleSeries(key: SeriesKey) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center gap-2" style={{ color: 'var(--text-3)' }}>
        <p className="text-sm">Registre gastos em ao menos 2 meses</p>
        <p className="text-xs opacity-60">O gráfico será gerado automaticamente</p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={265}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: 'var(--text-3)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: 'var(--text-3)' }}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} hidden={hidden} />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />

          <Bar
            dataKey="personalMonthly"
            name="Minha Inflação"
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            hide={hidden.has('personalMonthly')}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.personalMonthly >= 0 ? '#8B5CF6' : '#C4B5FD'} />
            ))}
          </Bar>

          <Bar
            dataKey="ipcaMonthly"
            name={ipcaLabel}
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
            hide={hidden.has('ipcaMonthly')}
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.ipcaMonthly >= 0 ? '#06B6D4' : '#67E8F9'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <CustomLegend hidden={hidden} onToggle={toggleSeries} />
    </div>
  );
}
