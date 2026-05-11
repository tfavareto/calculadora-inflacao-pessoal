import Sidebar from './Sidebar';
import { PageKey } from '../types';

interface Props {
  current: PageKey;
  onChange: (p: PageKey) => void;
  children: React.ReactNode;
}

export default function Layout({ current, onChange, children }: Props) {
  return (
    <div className="min-h-screen flex">
      <Sidebar current={current} onChange={onChange} />
      <main className="flex-1 ml-60 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
