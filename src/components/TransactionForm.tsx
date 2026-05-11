import { useState, FormEvent } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Transaction, TransactionType, IPCACategory } from '../types';
import { CATEGORY_LIST } from '../constants';
import CustomSelect from './CustomSelect';

interface Props {
  onAdd: (t: Transaction) => void;
  onClose: () => void;
}

export default function TransactionForm({ onAdd, onClose }: Props) {
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IPCACategory>('alimentacao_bebidas');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Informe a data';
    if (!description.trim()) e.description = 'Informe a descrição';
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)
      e.amount = 'Valor inválido';
    return e;
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    onAdd({
      id: crypto.randomUUID(),
      date,
      description: description.trim(),
      category: type === 'income' ? 'alimentacao_bebidas' : category,
      type,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
    });

    setDescription('');
    setAmount('');
    setErrors({});
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="w-full max-w-md p-6 relative rounded-2xl"
        style={{
          background: 'rgba(14, 11, 28, 0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-1)' }}>
          Nova Movimentação
        </h2>

        {/* Type toggle */}
        <div
          className="flex gap-1.5 p-1 rounded-xl mb-5"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {(['expense', 'income'] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={
                type === t
                  ? t === 'expense'
                    ? { background: 'rgba(244,63,94,0.2)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.3)' }
                    : { background: 'rgba(16,185,129,0.2)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }
                  : { color: 'var(--text-3)', border: '1px solid transparent' }
              }
            >
              {t === 'expense' ? 'Gasto' : 'Entrada'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`input ${errors.date ? 'border-rose-500/50 ring-rose-500/20' : ''}`}
              />
              {errors.date && <p className="text-xs text-rose-400 mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="label">Valor (R$)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`input ${errors.amount ? 'border-rose-500/50' : ''}`}
              />
              {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount}</p>}
            </div>
          </div>

          <div>
            <label className="label">Descrição</label>
            <input
              type="text"
              placeholder="Ex: Supermercado semanal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`input ${errors.description ? 'border-rose-500/50' : ''}`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description}</p>
            )}
          </div>

          {type === 'expense' && (
            <div>
              <label className="label">Grupo IPCA</label>
              <CustomSelect
                value={category}
                options={CATEGORY_LIST.map((c) => ({
                  value: c.value,
                  label: c.label,
                  emoji: c.emoji,
                  color: c.color,
                }))}
                onChange={(v) => setCategory(v as IPCACategory)}
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
          >
            <PlusCircle size={16} />
            Adicionar
          </button>
        </form>
      </div>
    </div>
  );
}
