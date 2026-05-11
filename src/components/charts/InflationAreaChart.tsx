import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { InflationPoint } from '../../types';
import { formatPct } from '../../formatters';

interface Props { data: InflationPoint[] }

const SERIES = [
  { key: 'personalAccumulated', label: 'Minha Inflação', color: '#8B5CF6', grad: 'gradPersonal', dash: undefined },
  { key: 'ipcaAccumulated',     label: 'IPCA Oficial',   color: '#06B6D4', grad: 'gradIPCA',     dash: '5 3'    },
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
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
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
            {/* linha com traço ou sólida conforme a série */}
            <svg width="16" height="10" className="shrink-0">
              {s.dash ? (
                <line
                  x1="0" y1="5" x2="16" y2="5"
                  stroke={isHidden ? 'rgba(255,255,255,0.2)' : s.color}
                  strokeWidth="2"
                  strokeDasharray={s.dash}
                />
              ) : (
                <line
                  x1="0" y1="5" x2="16" y2="5"
                  stroke={isHidden ? 'rgba(255,255,255,0.2)' : s.color}
                  strokeWidth="2"
                />
              )}
              <circle
                cx="8" cy="5" r="3"
                fill={isHidden ? 'rgba(255,255,255,0.2)' : s.color}
              />
            </svg>
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

export default function InflationAreaChart({ data }: Props) {
  const [hidden, setHidden] = useState<Set<SeriesKey>>(new Set());

  function toggleSeries(key: SeriesKey) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (data.length < 2) {
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
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradPersonal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradIPCA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#06B6D4" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
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
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />
          <Area
            type="monotone"
            dataKey="personalAccumulated"
            name="Minha Inflação"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#gradPersonal)"
            dot={false}
            activeDot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }}
            hide={hidden.has('personalAccumulated')}
          />
          <Area
            type="monotone"
            dataKey="ipcaAccumulated"
            name="IPCA Oficial"
            stroke="#06B6D4"
            strokeWidth={2}
            fill="url(#gradIPCA)"
            dot={false}
            activeDot={{ r: 4, fill: '#06B6D4', strokeWidth: 0 }}
            strokeDasharray="5 3"
            hide={hidden.has('ipcaAccumulated')}
          />
        </AreaChart>
      </ResponsiveContainer>

      <CustomLegend hidden={hidden} onToggle={toggleSeries} />
    </div>
  );
}
