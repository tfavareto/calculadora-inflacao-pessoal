import { LayoutDashboard, ArrowLeftRight, BookOpen, MapPin, HelpCircle, type LucideIcon } from 'lucide-react';
import { PageKey } from '../types';

interface Props {
  current: PageKey;
  onChange: (p: PageKey) => void;
}

const LINKS: { key: PageKey; label: string; Icon: LucideIcon }[] = [
  { key: 'dashboard',    label: 'Dashboard',  Icon: LayoutDashboard },
  { key: 'transactions', label: 'Gastos',     Icon: ArrowLeftRight  },
  { key: 'mycity',       label: 'Cidade',     Icon: MapPin          },
  { key: 'methodology',  label: 'Método',     Icon: BookOpen        },
  { key: 'inflation',    label: 'Inflação?',  Icon: HelpCircle      },
];

export default function MobileNav({ current, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around px-1 py-1.5"
      style={{
        background: 'var(--bg-sidebar)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 6px)',
      }}
    >
      {LINKS.map(({ key, label, Icon }) => {
        const active = current === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all duration-150 active:scale-95 min-w-[60px]"
            style={{
              color: active ? '#FB923C' : 'var(--text-3)',
              background: active ? 'rgba(249,115,22,0.12)' : 'transparent',
            }}
          >
            <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[9px] font-semibold leading-tight tracking-wide">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
