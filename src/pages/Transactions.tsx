import { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Transaction } from '../types';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

interface Props {
  transactions: Transaction[];
  onAdd: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onLoadDemoAbove: () => void;
  onLoadDemoBelow: () => void;
  onClear: () => void;
}

export default function Transactions({
  transactions, onAdd, onDelete, onLoadDemoAbove, onLoadDemoBelow, onClear,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  function handleClear() {
    if (clearConfirm) {
      onClear();
      setClearConfirm(false);
    } else {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>
            Movimentações
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-2)' }}>
            Registre seus gastos por grupo IPCA e suas entradas de renda
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {transactions.length === 0 ? (
            <>
              <button
                onClick={onLoadDemoAbove}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-150 active:scale-95"
                style={{
                  background: 'rgba(244,63,94,0.10)',
                  border: '1px solid rgba(244,63,94,0.25)',
                  color: '#FB7185',
                }}
                title="Casal com filhos — gastos pesados em alimentação, educação e saúde. Inflação pessoal ≈ 14,8 %"
              >
                <TrendingUp size={13} />
                Demo: Acima do IPCA
              </button>
              <button
                onClick={onLoadDemoBelow}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-medium transition-all duration-150 active:scale-95"
                style={{
                  background: 'rgba(16,185,129,0.10)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#34D399',
                }}
                title="Jovem profissional solteiro — gastos controlados, peso alto em moradia e comunicação. Inflação pessoal ≈ 6,4 %"
              >
                <TrendingDown size={13} />
                Demo: Abaixo do IPCA
              </button>
            </>
          ) : (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-150 active:scale-95"
              style={
                clearConfirm
                  ? { background: 'rgba(244,63,94,0.2)', color: '#FB7185', border: '1px solid rgba(244,63,94,0.3)' }
                  : { background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              <Trash2 size={14} />
              {clearConfirm ? 'Confirmar?' : 'Limpar tudo'}
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <PlusCircle size={15} />
            Nova Movimentação
          </button>
        </div>
      </div>

      <TransactionList transactions={transactions} onDelete={onDelete} />

      {showForm && (
        <TransactionForm
          onAdd={(t) => { onAdd(t); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
