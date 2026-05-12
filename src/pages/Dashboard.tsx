import { ArrowRight, Info, MapPin } from 'lucide-react';
import { Transaction, InflationPoint, CategoryWeight } from '../types';
import { getSummary } from '../calculator';
import SummaryCards from '../components/SummaryCards';
import InflationAreaChart from '../components/charts/InflationAreaChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import { formatBRL, formatPct } from '../formatters';
import { getRegion } from '../regions';

interface Props {
  transactions: Transaction[];
  inflationData: InflationPoint[];
  categoryWeights: CategoryWeight[];
  ipcaLoading: boolean;
  selectedRegionCode: string | null;
  onGoToTransactions: () => void;
  onGoToMyCity: () => void;
}

export default function Dashboard({
  transactions,
  inflationData,
  categoryWeights,
  ipcaLoading,
  selectedRegionCode,
  onGoToTransactions,
  onGoToMyCity,
}: Props) {
  const { totalExpense, totalIncome, firstDate, lastDate } = getSummary(transactions);
  const last = inflationData[inflationData.length - 1];
  const region = selectedRegionCode ? getRegion(selectedRegionCode) : null;

  const diff = last ? last.personalAccumulated - last.ipcaAccumulated : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
            Sua inflação pessoal vs. IPCA Nacional (Brasil)
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Atalho para Minha Cidade */}
          <button
            onClick={onGoToMyCity}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={region
              ? { background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#C4B5FD' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-3)' }
            }
            title="Ver comparativo com IPCA regional"
          >
            {region ? <><span>{region.emoji}</span>{region.city} →</> : <><MapPin size={12} />Minha Cidade</>}
          </button>
          {ipcaLoading && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                color: '#A78BFA',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Atualizando IPCA...
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <SummaryCards
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        firstDate={firstDate}
        lastDate={lastDate}
        inflationData={inflationData}
      />

      {/* Diff callout */}
      {last && (
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{
            background: diff > 0 ? 'rgba(244,63,94,0.08)' : diff < 0 ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${diff > 0 ? 'rgba(244,63,94,0.2)' : diff < 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          <Info
            size={16}
            className="mt-0.5 shrink-0"
            style={{ color: diff > 0 ? '#FB7185' : diff < 0 ? '#34D399' : 'var(--text-3)' }}
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
              {diff > 0
                ? `Sua inflação está ${formatPct(Math.abs(diff))} acima do IPCA no período`
                : diff < 0
                ? `Sua inflação está ${formatPct(Math.abs(diff))} abaixo do IPCA no período`
                : 'Sua inflação está em linha com o IPCA no período'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
              Minha inflação acumulada:{' '}
              <span className="font-semibold text-slate-200">{formatPct(last.personalAccumulated)}</span>
              {' '}·{' '}IPCA Nacional:{' '}
              <span className="font-semibold text-slate-200">{formatPct(last.ipcaAccumulated)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-1)' }}>
            Inflação Acumulada no Período
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
            Variação acumulada mês a mês — Pessoal vs. IPCA oficial
          </p>
          <InflationAreaChart data={inflationData} />
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-1)' }}>
            Variação Mensal
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
            Inflação do mês — Pessoal vs. IPCA oficial
          </p>
          <MonthlyBarChart data={inflationData} />
        </div>
      </div>

      {/* Category Weights */}
      {categoryWeights.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-1)' }}>
            Composição da sua Cesta (mês-base)
          </p>
          <p className="text-xs mb-5" style={{ color: 'var(--text-3)' }}>
            Peso de cada grupo IPCA no seu consumo — quanto você gasta em cada categoria
          </p>
          <div className="space-y-3">
            {categoryWeights.map((cw) => (
              <div key={cw.category} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{cw.emoji}</span>
                <span className="text-xs w-44 truncate" style={{ color: 'var(--text-2)' }}>
                  {cw.label}
                </span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(cw.weight * 100).toFixed(1)}%`, background: cw.color }}
                  />
                </div>
                <span className="text-xs font-semibold w-12 text-right" style={{ color: cw.color }}>
                  {(cw.weight * 100).toFixed(1)}%
                </span>
                <span className="text-xs w-24 text-right hidden md:block" style={{ color: 'var(--text-3)' }}>
                  {formatBRL(cw.baseSpend)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {transactions.length === 0 && (
        <div className="card p-14 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <span className="text-3xl">📊</span>
          </div>
          <p className="font-semibold text-lg mb-2" style={{ color: 'var(--text-1)' }}>
            Bem-vindo à Calculadora de Inflação Pessoal
          </p>
          <p className="text-sm max-w-md mx-auto leading-relaxed mb-6" style={{ color: 'var(--text-2)' }}>
            Registre seus gastos mensais por grupo IPCA e veja, em tempo real, como sua inflação
            pessoal se compara ao IPCA oficial do IBGE.
          </p>
          <button onClick={onGoToTransactions} className="btn-primary inline-flex items-center gap-2">
            Começar agora
            <ArrowRight size={15} />
          </button>
          <p className="text-xs mt-3" style={{ color: 'var(--text-3)' }}>
            Ou use <strong className="text-slate-400">Dados Demo</strong> na aba Movimentações para ver um exemplo.
          </p>
        </div>
      )}
    </div>
  );
}
