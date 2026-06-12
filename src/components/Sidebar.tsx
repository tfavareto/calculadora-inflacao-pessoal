import { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, BookOpen, MapPin, HelpCircle, type LucideIcon } from 'lucide-react';
import { PageKey } from '../types';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';

interface Props {
  current: PageKey;
  onChange: (p: PageKey) => void;
  selectedRegionCode?: string | null;
}

const LINKS: { key: PageKey; label: string; Icon: LucideIcon; desc: string }[] = [
  { key: 'dashboard',    label: 'Dashboard',          desc: 'Visão geral',        Icon: LayoutDashboard },
  { key: 'transactions', label: 'Movimentações',      desc: 'Seus gastos',        Icon: ArrowLeftRight  },
  { key: 'mycity',       label: 'Minha Cidade',       desc: 'IPCA regional',      Icon: MapPin          },
  { key: 'methodology',  label: 'Metodologia',        desc: 'Como calculamos',    Icon: BookOpen        },
  { key: 'inflation',    label: 'O que é Inflação?',  desc: 'Guia educativo',     Icon: HelpCircle      },
];

export default function Sidebar({ current, onChange }: Props) {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-60 flex flex-col z-30"
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          {/* Mini logo fiel à marca: moldura preta + barras/seta laranja */}
          <svg width="36" height="36" viewBox="0 0 100 100" fill="none" className="shrink-0">
            <rect x="5" y="8" width="68" height="68" rx="18" ry="18"
                  stroke="#FFFFFF" strokeWidth="9" fill="none"/>
            <rect x="13" y="57" width="13" height="13" rx="3" fill="#F97316"/>
            <rect x="30" y="47" width="13" height="23" rx="3" fill="#F97316"/>
            <rect x="47" y="37" width="13" height="33" rx="3" fill="#F97316"/>
            <polyline points="16,62 34,50 52,39 88,6"
                      stroke="#F97316" strokeWidth="8"
                      strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="74,2 89,6 85,21"
                      stroke="#F97316" strokeWidth="8"
                      strokeLinecap="round" strokeLinejoin="round"
                      fill="none"/>
          </svg>
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
        {/* Instagram */}
        <a
          href="https://instagram.com/macro_panorama"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-1 py-0.5 rounded transition-opacity hover:opacity-70"
        >
          {/* Instagram icon SVG */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0" style={{ color: 'var(--text-3)' }}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
          </svg>
          <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>@macro_panorama</span>
        </a>

        {/* Termos de Uso */}
        <button
          onClick={() => setShowTerms(true)}
          className="block w-full text-left px-1 py-0.5 text-[11px] rounded transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-3)' }}
        >
          Termos de Uso
        </button>

        {/* Política de Privacidade */}
        <button
          onClick={() => setShowPrivacy(true)}
          className="block w-full text-left px-1 py-0.5 text-[11px] rounded transition-opacity hover:opacity-70"
          style={{ color: 'var(--text-3)' }}
        >
          Política de Privacidade
        </button>
      </div>

      {showTerms   && <TermsModal   onClose={() => setShowTerms(false)}   />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </aside>
  );
}
