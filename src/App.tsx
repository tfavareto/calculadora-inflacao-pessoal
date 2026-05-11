import { useState, useEffect, useCallback } from 'react';
import { Transaction, InflationPoint, CategoryWeight, PageKey } from './types';
import { loadTransactions, saveTransactions } from './storage';
import { calculateInflation, getCategoryWeights } from './calculator';
import { fetchIPCARange } from './ibgeApi';
import { FALLBACK_IPCA } from './constants';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Methodology from './pages/Methodology';

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [ipcaData, setIpcaData] = useState<Record<string, number>>(FALLBACK_IPCA);
  const [ipcaLoading, setIpcaLoading] = useState(false);
  const [inflationData, setInflationData] = useState<InflationPoint[]>([]);
  const [categoryWeights, setCategoryWeights] = useState<CategoryWeight[]>([]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    setInflationData(calculateInflation(transactions, ipcaData));
    setCategoryWeights(getCategoryWeights(transactions));
  }, [transactions, ipcaData]);

  const refreshIPCA = useCallback(async () => {
    setIpcaLoading(true);
    const data = await fetchIPCARange('202201', '202512');
    setIpcaData(data);
    setIpcaLoading(false);
  }, []);

  useEffect(() => {
    refreshIPCA();
  }, [refreshIPCA]);

  function handleAdd(t: Transaction) {
    setTransactions((prev) => [...prev, t]);
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function handleLoadDemo(ts: Transaction[]) {
    setTransactions(ts);
    setPage('dashboard');
  }

  function handleClear() {
    setTransactions([]);
  }

  return (
    <Layout current={page} onChange={setPage}>
      {page === 'dashboard' && (
        <Dashboard
          transactions={transactions}
          inflationData={inflationData}
          categoryWeights={categoryWeights}
          ipcaLoading={ipcaLoading}
          onGoToTransactions={() => setPage('transactions')}
        />
      )}
      {page === 'transactions' && (
        <Transactions
          transactions={transactions}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onLoadDemo={handleLoadDemo}
          onClear={handleClear}
        />
      )}
      {page === 'methodology' && <Methodology />}
    </Layout>
  );
}
