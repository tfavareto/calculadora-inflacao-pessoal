import { useState } from 'react';
import { MapPin, Settings2, CheckCircle2, XCircle, Info, ArrowRight } from 'lucide-react';
import { Transaction, InflationPoint, CategoryWeight } from '../types';
import { getSummary } from '../calculator';
import { REGIONS, getRegion } from '../regions';
import SummaryCards from '../components/SummaryCards';
import InflationAreaChart from '../components/charts/InflationAreaChart';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CustomSelect from '../components/CustomSelect';
import { formatBRL, formatPct } from '../formatters';

interface Props {
  transactions: Transaction[];
  inflationData: InflationPoint[];
  categoryWeights: CategoryWeight[];
  selectedRegionCode: string | null;
  hasRegionalData: boolean;
  regionalLoading: boolean;
  onSelect: (ibgeCode: string | null) => void;
}

export default function MyCity({
  transactions,
  inflationData,
  categoryWeights,
  selectedRegionCode,
  hasRegionalData,
  regionalLoading,
  onSelect,
}: Props) {
  const [showSelector, setShowSelector] = useState(!selectedRegionCode);
  const [draft, setDraft] = useState<string>(selectedRegionCode ?? '');

  const region = selectedRegionCode ? getRegion(selectedRegionCode) : null;
  const ipcaLabel = hasRegionalData && region
    ? `IPCA de ${region.city}`
    : 'IPCA Nacional';

  const { totalExpense, totalIncome, firstDate, lastDate } = getSummary(transactions);
  const last = inflationData[inflationData.length - 1];
  const diff = last ? last.personalAccumulated - last.ipcaAccumulated : 0;

  function handleApply() {
    if (draft) { onSelect(draft); setShowSelector(false); }
  }

  function handleRemove() {
    setDraft(''); onSelect(null); setShowSelector(true);
  }

  /* ── Empty state ───────────────────────────────────────────── */
  if (!selectedRegionCode) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>Minha Cidade</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
            Compare sua inflação com o IPCA regional oficial do IBGE
          </p>
        </div>

        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3"
          style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)' }}
        >
          <Info size={15} className="mt-0.5 shrink-0" style={{ color: '#A78BFA' }} />
          <div className="text-sm space-y-1" style={{ color: 'var(--text-2)' }}>
            <p>
              O IBGE calcula o IPCA para <strong className="text-slate-200">13 áreas de coleta</strong> específicas.
              Selecione a mais próxima de você para ver sua inflação pessoal comparada ao índice regional.
            </p>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>
              Fonte: IBGE SIDRA — Tabela 7169, Variável 63 (variação mensal %)
            </p>
          </div>
        </div>

        <div
          className="p-5 rounded-2xl space-y-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
            Selecione sua área de coleta
          </p>
          <CustomSelect
            value={draft}
            onChange={setDraft}
            placeholder="Escolha a cidade mais próxima…"
            options={REGIONS.map((r) => ({ value: r.ibgeCode, label: r.label }))}
          />
          <button
            onClick={handleApply}
            disabled={!draft}
            className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight size={15} />
            Ver meu IPCA regional
          </button>
        </div>
      </div>
    );
  }

  /* ── Dashboard regional ────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>Minha Cidade</h1>
            {regionalLoading && (
              <span
                className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Atualizando…
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            Sua inflação pessoal vs. {ipcaLabel}
          </p>
        </div>
        <button
          onClick={() => setShowSelector((v) => !v)}
          className="btn-secondary flex items-center gap-2 shrink-0 text-xs"
        >
          <Settings2 size={13} />
          {showSelector ? 'Fechar' : 'Trocar cidade'}
        </button>
      </div>

      {/* Seletor inline (collapsível) — sem backdrop-blur para não criar stacking context */}
      {showSelector && (
        <div
          className="flex flex-wrap items-end gap-3 p-4 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(139,92,246,0.25)',
            position: 'relative',
            zIndex: 20,
          }}
        >
          <div className="flex-1 min-w-48">
            <p className="label">Área de coleta</p>
            <CustomSelect
              value={draft}
              onChange={setDraft}
              options={REGIONS.map((r) => ({ value: r.ibgeCode, label: r.label }))}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              disabled={!draft || draft === selectedRegionCode}
              className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-40"
            >
              <CheckCircle2 size={13} /> Aplicar
            </button>
            <button onClick={handleRemove} className="btn-secondary flex items-center gap-1.5 text-xs">
              <XCircle size={13} /> Remover
            </button>
          </div>
        </div>
      )}

      {/* Aviso quando sem dados regionais */}
      {!regionalLoading && selectedRegionCode && !hasRegionalData && (
        <div
          className="rounded-2xl px-5 py-3 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <Info size={14} className="shrink-0" style={{ color: '#FCD34D' }} />
          <p className="text-xs" style={{ color: 'var(--text-2)' }}>
            Dados regionais do IBGE indisponíveis para {region?.city}. Exibindo IPCA nacional como referência.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <SummaryCards
        totalExpense={totalExpense}
        totalIncome={totalIncome}
        firstDate={firstDate}
        lastDate={lastDate}
        inflationData={inflationData}
        ipcaLabel={ipcaLabel}
      />

      {/* Callout diff */}
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
                ? `Sua inflação está ${formatPct(Math.abs(diff))} acima do ${ipcaLabel} no período`
                : diff < 0
                ? `Sua inflação está ${formatPct(Math.abs(diff))} abaixo do ${ipcaLabel} no período`
                : `Sua inflação está em linha com o ${ipcaLabel} no período`}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>
              Minha inflação acumulada:{' '}
              <span className="font-semibold text-slate-200">{formatPct(last.personalAccumulated)}</span>
              {' '}·{' '}{ipcaLabel}:{' '}
              <span className="font-semibold text-slate-200">{formatPct(last.ipcaAccumulated)}</span>
            </p>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-1)' }}>
            Inflação Acumulada no Período
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
            Variação acumulada mês a mês — Pessoal vs. {ipcaLabel}
          </p>
          <InflationAreaChart data={inflationData} ipcaLabel={ipcaLabel} />
        </div>

        <div className="card p-5">
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-1)' }}>
            Variação Mensal
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-3)' }}>
            Inflação do mês — Pessoal vs. {ipcaLabel}
          </p>
          <MonthlyBarChart data={inflationData} ipcaLabel={ipcaLabel} />
        </div>
      </div>

      {/* Composição da cesta */}
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

      {/* Sem transações */}
      {transactions.length === 0 && (
        <div className="card p-12 text-center">
          <MapPin size={32} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
          <p className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
            Nenhuma movimentação cadastrada
          </p>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            Adicione gastos na aba <strong className="text-slate-400">Movimentações</strong> para ver os gráficos.
          </p>
        </div>
      )}
    </div>
  );
}
