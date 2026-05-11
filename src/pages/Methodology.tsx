import { CATEGORIES } from '../constants';
import { IPCACategory } from '../types';

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)' }}
        >
          {n}
        </div>
        <div className="w-px flex-1 mt-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div className="pb-8">
        <p className="font-semibold mb-1.5 text-sm" style={{ color: 'var(--text-1)' }}>{title}</p>
        <div className="text-sm leading-relaxed space-y-1.5" style={{ color: 'var(--text-2)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl px-4 py-3 font-mono text-sm my-3 overflow-x-auto"
      style={{
        background: 'rgba(139,92,246,0.08)',
        border: '1px solid rgba(139,92,246,0.18)',
        color: '#C4B5FD',
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase tracking-widest mb-5"
      style={{ color: 'var(--text-3)' }}
    >
      {children}
    </p>
  );
}

export default function Methodology() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>Metodologia de Cálculo</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
          Como a sua inflação pessoal é estimada a partir das suas movimentações
        </p>
      </div>

      {/* Steps */}
      <div className="card p-6">
        <SectionHeader>Índice de Preços Pessoal — Passo a Passo</SectionHeader>

        <Step n={1} title="Agrupamento por mês e categoria">
          <p>
            Todas as transações do tipo <strong className="text-slate-300">Gasto</strong> são
            agrupadas por <em>mês (AAAA-MM)</em> e por <em>grupo IPCA</em>.
          </p>
          <Formula>E(c, m) = Σ valores dos gastos na categoria c no mês m</Formula>
        </Step>

        <Step n={2} title="Definição do período-base">
          <p>
            O <strong className="text-slate-300">mês-base (M₀)</strong> é o primeiro mês com
            algum gasto registrado. A inflação acumulada em M₀ é <strong className="text-slate-300">0%</strong>.
          </p>
        </Step>

        <Step n={3} title="Cálculo dos pesos pessoais">
          <p>
            Os pesos de cada categoria são calculados a partir do gasto no mês-base — quanto mais
            você gasta em uma categoria, maior o seu peso no índice:
          </p>
          <Formula>w(c) = E(c, M₀) / Σ E(c, M₀)</Formula>
        </Step>

        <Step n={4} title="Índice de Preços Pessoal (IPP — tipo Laspeyres)">
          <p>Para cada mês <em>t</em>, o IPP compara o custo da sua cesta atual vs. o período-base:</p>
          <Formula>IPP(t) = Σ [ w(c) × E(c, t) / E(c, M₀) ] × 100</Formula>
          <p className="text-xs opacity-70 mt-1">
            Categorias sem gasto em algum dos meses são descartadas e os pesos renormalizados.
          </p>
        </Step>

        <Step n={5} title="Inflação mensal e acumulada">
          <Formula>π_pessoal(t) = [ IPP(t) / IPP(t−1) − 1 ] × 100 %</Formula>
          <Formula>Acumulado(t) = [ IPP(t) / 100 − 1 ] × 100 %</Formula>
        </Step>

        <Step n={6} title="Comparação com o IPCA oficial">
          <p>
            Os dados mensais do <strong className="text-slate-300">IPCA</strong> são obtidos via
            API do IBGE / SIDRA (agregado 433, variável 63) com fallback local 2022–2025.
          </p>
          <Formula>IPCA_acum(t) = [ Π (1 + ipca_i/100) − 1 ] × 100 %</Formula>
        </Step>
      </div>

      {/* Limitations */}
      <div className="card p-6">
        <SectionHeader>Premissas e Limitações</SectionHeader>
        <ul className="space-y-3 text-sm" style={{ color: 'var(--text-2)' }}>
          {[
            {
              icon: '⚠',
              color: '#FCD34D',
              title: 'Quantidade vs. Preço',
              text: 'O índice usa o gasto como proxy do nível de preços. Gastos sobem tanto por preços mais altos quanto por mais consumo.',
            },
            {
              icon: '⚠',
              color: '#FCD34D',
              title: 'Pesos fixos',
              text: 'Os pesos são fixados no mês-base. Se seu consumo mudar muito, o índice pode subvalorizar categorias que ganharam importância.',
            },
            {
              icon: '⚠',
              color: '#FCD34D',
              title: 'Dados incompletos',
              text: 'Meses sem gasto em uma categoria são descartados da média ponderada daquele mês.',
            },
            {
              icon: '✓',
              color: '#34D399',
              title: 'IPCA offline',
              text: 'Quando a API do IBGE está indisponível, os dados históricos (2022–2025) são carregados de uma base embutida.',
            },
          ].map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="text-base mt-0.5" style={{ color: item.color }}>{item.icon}</span>
              <span>
                <strong className="text-slate-300">{item.title}:</strong> {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* IPCA groups */}
      <div className="card p-6">
        <SectionHeader>Grupos do IPCA — Pesos Oficiais (IBGE)</SectionHeader>
        <div className="space-y-2.5">
          {(Object.keys(CATEGORIES) as IPCACategory[]).map((key) => {
            const c = CATEGORIES[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{c.emoji}</span>
                <span className="text-sm flex-1" style={{ color: 'var(--text-2)' }}>{c.label}</span>
                <div
                  className="w-32 h-1.5 rounded-full overflow-hidden hidden sm:block"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(c.officialWeight / 23.2) * 100}%`, background: c.color }}
                  />
                </div>
                <span className="text-xs font-semibold w-12 text-right" style={{ color: c.color }}>
                  {c.officialWeight.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-5" style={{ color: 'var(--text-3)' }}>
          * A calculadora usa os <strong className="text-slate-400">pesos do seu consumo real</strong>,
          não os pesos oficiais acima. Os pesos oficiais são mostrados apenas como referência.
        </p>
      </div>
    </div>
  );
}
