import { TrendingUp, Wallet, Calendar, type LucideIcon } from 'lucide-react';
import { InflationPoint } from '../types';
import { formatBRL, formatPct, formatDate } from '../formatters';

interface Props {
  totalExpense: number;
  totalIncome: number;
  firstDate: string | null;
  lastDate: string | null;
  inflationData: InflationPoint[];
}

interface CardProps {
  title: string;
  value: string;
  sub?: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  badge?: { label: string; positive: boolean } | null;
}

function Card({ title, value, sub, Icon, iconBg, iconColor, valueColor, badge }: CardProps) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
        {badge && (
          <span
            className={`chip ${badge.positive ? 'chip-emerald' : 'chip-rose'}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-3)' }}>
          {title}
        </p>
        <p
          className="text-2xl font-bold tracking-tight"
          style={{ color: valueColor ?? 'var(--text-1)' }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function SummaryCards({
  totalExpense,
  totalIncome,
  firstDate,
  lastDate,
  inflationData,
}: Props) {
  const last = inflationData[inflationData.length - 1];
  const personalAcc = last?.personalAccumulated ?? null;
  const ipcaAcc = last?.ipcaAccumulated ?? null;

  const period =
    firstDate && lastDate
      ? `${formatDate(firstDate)} → ${formatDate(lastDate)}`
      : 'Sem dados';

  const diff = personalAcc !== null && ipcaAcc !== null ? personalAcc - ipcaAcc : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        title="Total de Gastos"
        value={formatBRL(totalExpense)}
        sub={period}
        Icon={Wallet}
        iconBg="rgba(244, 63, 94, 0.15)"
        iconColor="#FB7185"
      />
      <Card
        title="Total de Entradas"
        value={formatBRL(totalIncome)}
        sub={period}
        Icon={Wallet}
        iconBg="rgba(16, 185, 129, 0.15)"
        iconColor="#34D399"
      />
      <Card
        title="Minha Inflação (Acum.)"
        value={personalAcc !== null ? formatPct(personalAcc) : '—'}
        sub={last ? `Mensal: ${formatPct(last.personalMonthly)}` : 'Insuficiente — 2+ meses'}
        Icon={TrendingUp}
        iconBg="rgba(139, 92, 246, 0.15)"
        iconColor="#A78BFA"
        valueColor={personalAcc !== null && personalAcc > 0 ? '#FB7185' : personalAcc !== null && personalAcc < 0 ? '#34D399' : undefined}
        badge={
          diff !== null
            ? { label: diff > 0 ? `+${diff.toFixed(2)}pp vs IPCA` : `${diff.toFixed(2)}pp vs IPCA`, positive: diff <= 0 }
            : null
        }
      />
      <Card
        title="IPCA Acumulado"
        value={ipcaAcc !== null ? formatPct(ipcaAcc) : '—'}
        sub={last ? `Mensal: ${formatPct(last.ipcaMonthly)}` : 'Aguardando dados'}
        Icon={Calendar}
        iconBg="rgba(6, 182, 212, 0.15)"
        iconColor="#22D3EE"
        valueColor={ipcaAcc !== null && ipcaAcc > 0 ? '#FCD34D' : undefined}
      />
    </div>
  );
}
