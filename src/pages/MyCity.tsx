import { useState } from 'react';
import { MapPin, CheckCircle2, XCircle, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { REGIONS, getRegion } from '../regions';
import CustomSelect from '../components/CustomSelect';
import { formatPct } from '../formatters';

interface Props {
  selectedRegionCode: string | null;
  onSelect: (ibgeCode: string | null) => void;
  regionalIpca: Record<string, number>;
  nationalIpca: Record<string, number>;
  regionalLoading: boolean;
}

function last12Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${y}${m}`);
  }
  return months;
}

function monthLabel(yyyymm: string): string {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const m = parseInt(yyyymm.slice(4, 6), 10) - 1;
  const y = yyyymm.slice(2, 4);
  return `${months[m]}/${y}`;
}

export default function MyCity({
  selectedRegionCode,
  onSelect,
  regionalIpca,
  nationalIpca,
  regionalLoading,
}: Props) {
  const [draft, setDraft] = useState<string>(selectedRegionCode ?? '');
  const region = selectedRegionCode ? getRegion(selectedRegionCode) : null;

  const months = last12Months();
  const hasRegional = Object.keys(regionalIpca).length > 0 && selectedRegionCode;

  // Acumulado 12 meses: produto de (1 + var/100)
  function accumulated(data: Record<string, number>, keys: string[]): number {
    return keys.reduce((acc, k) => {
      const v = data[k];
      return v !== undefined ? acc * (1 + v / 100) : acc;
    }, 1) * 100 - 100;
  }

  const available = months.filter((m) => regionalIpca[m] !== undefined || nationalIpca[m] !== undefined);
  const regAcc  = hasRegional ? accumulated(regionalIpca,  available) : null;
  const natAcc  = accumulated(nationalIpca, available);
  const diff    = regAcc !== null ? regAcc - natAcc : null;

  function handleApply() {
    if (draft) onSelect(draft);
  }

  function handleRemove() {
    setDraft('');
    onSelect(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>Minha Cidade</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
          IPCA regional oficial do IBGE para a sua área de coleta
        </p>
      </div>

      {/* Explicação */}
      <div
        className="rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)' }}
      >
        <Info size={15} className="mt-0.5 shrink-0" style={{ color: '#A78BFA' }} />
        <div className="text-sm space-y-1" style={{ color: 'var(--text-2)' }}>
          <p>
            O IBGE calcula o IPCA para <strong className="text-slate-200">13 áreas de coleta</strong> específicas no Brasil.
            Ao selecionar a cidade mais próxima de você, o Dashboard passa a comparar sua inflação
            pessoal com o <strong className="text-slate-200">IPCA regional oficial</strong> dessa área,
            em vez do índice nacional agregado.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>
            Fonte: IBGE SIDRA — Tabela 7169, Variável 63 (variação mensal %)
          </p>
        </div>
      </div>

      {/* Seletor */}
      <div className="card p-5 space-y-4">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
          Selecione sua área de coleta
        </p>

        <CustomSelect
          value={draft}
          onChange={setDraft}
          placeholder="Escolha a cidade mais próxima…"
          options={REGIONS.map((r) => ({
            value: r.ibgeCode,
            label: r.label,
            emoji: r.emoji,
          }))}
        />

        <div className="flex gap-3">
          <button
            onClick={handleApply}
            disabled={!draft || draft === selectedRegionCode}
            className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={15} />
            Aplicar
          </button>
          {selectedRegionCode && (
            <button onClick={handleRemove} className="btn-secondary flex items-center gap-2">
              <XCircle size={15} />
              Remover cidade
            </button>
          )}
        </div>

        {selectedRegionCode && draft === selectedRegionCode && (
          <div
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399' }}
          >
            <CheckCircle2 size={13} />
            {region?.emoji} {region?.label} — IPCA regional ativo no Dashboard
          </div>
        )}
      </div>

      {/* Comparativo nacional vs regional */}
      {selectedRegionCode && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                IPCA Regional vs. Nacional — últimos 12 meses
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                {region?.emoji} {region?.label} · Variação mensal (%)
              </p>
            </div>
            {regionalLoading && (
              <span
                className="text-xs px-2 py-1 rounded-lg flex items-center gap-1.5"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Carregando…
              </span>
            )}
          </div>

          {/* Acumulado */}
          {!regionalLoading && regAcc !== null && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>
                  Regional (acum.)
                </p>
                <p className="text-lg font-bold" style={{ color: '#C4B5FD' }}>
                  {formatPct(regAcc)}
                </p>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}
              >
                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>
                  Nacional (acum.)
                </p>
                <p className="text-lg font-bold" style={{ color: '#22D3EE' }}>
                  {formatPct(natAcc)}
                </p>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{
                  background: diff! > 0 ? 'rgba(244,63,94,0.08)' : diff! < 0 ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${diff! > 0 ? 'rgba(244,63,94,0.2)' : diff! < 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>
                  Diferença
                </p>
                <div className="flex items-center justify-center gap-1">
                  {diff! > 0
                    ? <TrendingUp size={14} style={{ color: '#FB7185' }} />
                    : diff! < 0
                    ? <TrendingDown size={14} style={{ color: '#34D399' }} />
                    : <Minus size={14} style={{ color: 'var(--text-3)' }} />}
                  <p
                    className="text-lg font-bold"
                    style={{ color: diff! > 0 ? '#FB7185' : diff! < 0 ? '#34D399' : 'var(--text-2)' }}
                  >
                    {diff! > 0 ? '+' : ''}{formatPct(diff!)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabela mês a mês */}
          {!regionalLoading && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <th className="text-left pb-2 font-semibold" style={{ color: 'var(--text-3)' }}>Mês</th>
                    <th className="text-right pb-2 font-semibold" style={{ color: '#C4B5FD' }}>Regional</th>
                    <th className="text-right pb-2 font-semibold" style={{ color: '#22D3EE' }}>Nacional</th>
                    <th className="text-right pb-2 font-semibold" style={{ color: 'var(--text-3)' }}>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((m) => {
                    const reg = regionalIpca[m];
                    const nat = nationalIpca[m];
                    const d = reg !== undefined && nat !== undefined ? reg - nat : null;
                    return (
                      <tr
                        key={m}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <td className="py-2" style={{ color: 'var(--text-2)' }}>{monthLabel(m)}</td>
                        <td className="py-2 text-right font-semibold" style={{ color: reg !== undefined ? '#C4B5FD' : 'var(--text-3)' }}>
                          {reg !== undefined ? formatPct(reg) : '—'}
                        </td>
                        <td className="py-2 text-right font-semibold" style={{ color: nat !== undefined ? '#22D3EE' : 'var(--text-3)' }}>
                          {nat !== undefined ? formatPct(nat) : '—'}
                        </td>
                        <td
                          className="py-2 text-right font-semibold"
                          style={{ color: d === null ? 'var(--text-3)' : d > 0 ? '#FB7185' : d < 0 ? '#34D399' : 'var(--text-2)' }}
                        >
                          {d !== null ? (d > 0 ? '+' : '') + formatPct(d) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {regionalLoading && (
            <div className="h-40 flex items-center justify-center" style={{ color: 'var(--text-3)' }}>
              <p className="text-sm">Carregando dados regionais do IBGE…</p>
            </div>
          )}
        </div>
      )}

      {/* MapPin decorativo quando nenhuma cidade selecionada */}
      {!selectedRegionCode && (
        <div className="card p-14 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <MapPin size={24} style={{ color: '#A78BFA' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
            Nenhuma cidade selecionada
          </p>
          <p className="text-sm max-w-sm mx-auto" style={{ color: 'var(--text-3)' }}>
            Selecione a área de coleta mais próxima de você para usar o IPCA regional no Dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
