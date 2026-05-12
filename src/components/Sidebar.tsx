import { LayoutDashboard, ArrowLeftRight, BookOpen, TrendingUp, MapPin, HelpCircle, type LucideIcon } from 'lucide-react';
import { PageKey } from '../types';
import { getRegion } from '../regions';

interface Props {
  current: PageKey;
  onChange: (p: PageKey) => void;
  selectedRegionCode: string | null;
}

const LINKS: { key: PageKey; label: string; Icon: LucideIcon; desc: string }[] = [
  { key: 'dashboard',    label: 'Dashboard',          desc: 'Visão geral',        Icon: LayoutDashboard },
  { key: 'transactions', label: 'Movimentações',      desc: 'Seus gastos',        Icon: ArrowLeftRight  },
  { key: 'mycity',       label: 'Minha Cidade',       desc: 'IPCA regional',      Icon: MapPin          },
  { key: 'methodology',  label: 'Metodologia',        desc: 'Como calculamos',    Icon: BookOpen        },
  { key: 'inflation',    label: 'O que é Inflação?',  desc: 'Guia educativo',     Icon: HelpCircle      },
];

export default function Sidebar({ current, onChange, selectedRegionCode }: Props) {
  const region = selectedRegionCode ? getRegion(selectedRegionCode) : null;
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C2D00, #F97316)' }}
          >
            <TrendingUp size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight tracking-tight">
              Meu IPCA
            </p>
            <p className="text-xs leading-tight font-medium" style={{ color: 'var(--text-3)' }}>
              Inflação Pessoal
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-5 space-y-1">
        <p
          className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: 'var(--text-3)' }}
        >
          Menu
        </p>
        {LINKS.map(({ key, label, desc, Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`sidebar-link w-full text-left ${current === key ? 'active' : ''}`}
          >
            <Icon size={15} className="shrink-0" />
            <div>
              <p className="text-xs leading-tight">{label}</p>
              <p className="text-[10px] leading-tight opacity-50 mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Cidade selecionada */}
        {region && (
          <button
            onClick={() => onChange('mycity')}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
            style={{ background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.22)' }}
          >
            <MapPin size={13} className="shrink-0" style={{ color: '#F97316' }} />
            <div className="flex-1 text-left min-w-0">
              <p className="text-[11px] font-semibold truncate" style={{ color: '#FB923C' }}>
                {region.city}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>IPCA regional ativo</p>
            </div>
          </button>
        )}
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow shrink-0" />
          <p className="text-[11px] font-medium" style={{ color: 'var(--text-3)' }}>
            IPCA via IBGE/SIDRA
          </p>
        </div>
      </div>
    </aside>
  );
}
