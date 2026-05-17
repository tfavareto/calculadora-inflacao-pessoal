import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { PageKey } from '../types';

interface Props {
  current: PageKey;
  onChange: (p: PageKey) => void;
  selectedRegionCode: string | null;
  children: React.ReactNode;
}

export default function Layout({ current, onChange, selectedRegionCode, children }: Props) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar — desktop only */}
      <div className="hidden md:block">
        <Sidebar current={current} onChange={onChange} selectedRegionCode={selectedRegionCode} />
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <MobileNav current={current} onChange={onChange} />
    </div>
  );
}
