import { useState } from 'react';
import { Trash2, Search } from 'lucide-react';
import { Transaction, IPCACategory } from '../types';
import { CATEGORIES } from '../constants';
import { formatBRL, formatDate } from '../formatters';
import CustomSelect from './CustomSelect';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterCat, setFilterCat] = useState<IPCACategory | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = transactions
    .filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCat !== 'all' && t.category !== filterCat) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  if (transactions.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-4xl block mb-3">📋</span>
        <p className="font-medium mb-1" style={{ color: 'var(--text-1)' }}>
          Nenhuma movimentação cadastrada
        </p>
        <p className="text-sm" style={{ color: 'var(--text-3)' }}>
          Clique em "Nova Movimentação" ou carregue os Dados Demo para começar.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Filters */}
      <div
        className="p-4 flex flex-wrap gap-3 items-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="relative flex-1 min-w-40">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-8 py-2 text-xs"
          />
        </div>

        <CustomSelect
          value={filterType}
          onChange={(v) => setFilterType(v as typeof filterType)}
          options={[
            { value: 'all',     label: 'Todos os tipos' },
            { value: 'expense', label: 'Gastos',   emoji: '🔴' },
            { value: 'income',  label: 'Entradas', emoji: '🟢' },
          ]}
        />

        <CustomSelect
          value={filterCat}
          onChange={(v) => setFilterCat(v as IPCACategory | 'all')}
          options={[
            { value: 'all', label: 'Todos os grupos' },
            ...Object.entries(CATEGORIES).map(([k, v]) => ({
              value: k,
              label: v.label,
              emoji: v.emoji,
              color: v.color,
            })),
          ]}
        />

        <span className="text-xs ml-auto" style={{ color: 'var(--text-3)' }}>
          {filtered.length} de {transactions.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Data', 'Descrição', 'Grupo', 'Valor', ''].map((h, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left ${i === 3 ? 'text-right' : ''} ${i === 2 ? 'hidden sm:table-cell' : ''} ${i === 4 ? 'w-10' : ''}`}
                  style={{ color: 'var(--text-3)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const cat = CATEGORIES[t.category];
              return (
                <tr
                  key={t.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  className="transition-colors duration-100 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: 'var(--text-3)' }}>
                    {formatDate(t.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm" style={{ color: 'var(--text-1)' }}>
                        {t.description}
                      </span>
                      <span
                        className="chip"
                        style={
                          t.type === 'expense'
                            ? { background: 'rgba(244,63,94,0.12)', color: '#FB7185' }
                            : { background: 'rgba(16,185,129,0.12)', color: '#34D399' }
                        }
                      >
                        {t.type === 'expense' ? 'Gasto' : 'Entrada'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {t.type === 'expense' ? (
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{ background: cat.bgColor + '22', color: cat.color }}
                      >
                        {cat.emoji} {cat.label}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>—</span>
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-semibold text-sm whitespace-nowrap"
                    style={{ color: t.type === 'expense' ? '#FB7185' : '#34D399' }}
                  >
                    {t.type === 'expense' ? '−' : '+'}{formatBRL(t.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg transition-all"
                      style={
                        deleteConfirm === t.id
                          ? { background: 'rgba(244,63,94,0.2)', color: '#FB7185' }
                          : { color: 'var(--text-3)' }
                      }
                      title={deleteConfirm === t.id ? 'Clique para confirmar' : 'Excluir'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
