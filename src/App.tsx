import { useState, useEffect, useCallback } from 'react';
import { Transaction, InflationPoint, CategoryWeight, PageKey } from './types';
import { loadRegion, saveRegion } from './storage';
import { calculateInflation, getCategoryWeights } from './calculator';
import {
  apiGetTransactions,
  apiAddTransaction,
  apiDeleteTransaction,
  apiClearTransactions,
  apiLoadDemo,
  apiGetNationalIPCA,
  apiGetRegionalIPCA,
} from './api/client';
import { FALLBACK_IPCA } from './constants';
import { DEMO_TRANSACTIONS } from './demoData';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Methodology from './pages/Methodology';
import MyCity from './pages/MyCity';

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  // IPCA nacional
  const [nationalIpca, setNationalIpca] = useState<Record<string, number>>(FALLBACK_IPCA);
  const [ipcaLoading, setIpcaLoading] = useState(false);

  // IPCA regional
  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(() => loadRegion());
  const [regionalIpca, setRegionalIpca] = useState<Record<string, number>>({});
  const [regionalLoading, setRegionalLoading] = useState(false);

  // IPCA ativo: regional se cidade selecionada E dados carregados, nacional caso contrário
  const hasRegionalData = selectedRegionCode !== null && Object.keys(regionalIpca).length > 0;
  const activeIpca = hasRegionalData ? regionalIpca : nationalIpca;

  const [inflationData, setInflationData] = useState<InflationPoint[]>([]);
  const [categoryWeights, setCategoryWeights] = useState<CategoryWeight[]>([]);

  // Recalcula inflação quando dados mudam
  useEffect(() => {
    setInflationData(calculateInflation(transactions, activeIpca));
    setCategoryWeights(getCategoryWeights(transactions));
  }, [transactions, activeIpca]);

  // Carrega transações do backend na montagem
  useEffect(() => {
    setTxLoading(true);
    apiGetTransactions()
      .then(setTransactions)
      .catch(() => setTransactions([]))
      .finally(() => setTxLoading(false));
  }, []);

  // Fetch IPCA nacional do backend
  const refreshNationalIPCA = useCallback(async () => {
    setIpcaLoading(true);
    const data = await apiGetNationalIPCA('202201', '202612');
    setNationalIpca(data);
    setIpcaLoading(false);
  }, []);

  // Fetch IPCA regional do backend
  const refreshRegionalIPCA = useCallback(async (code: string) => {
    setRegionalLoading(true);
    const data = await apiGetRegionalIPCA(code, '202201', '202612');
    setRegionalIpca(data);
    setRegionalLoading(false);
  }, []);

  useEffect(() => { refreshNationalIPCA(); }, [refreshNationalIPCA]);

  useEffect(() => {
    if (selectedRegionCode) refreshRegionalIPCA(selectedRegionCode);
    else setRegionalIpca({});
  }, [selectedRegionCode, refreshRegionalIPCA]);

  // Handlers
  async function handleAdd(t: Transaction) {
    await apiAddTransaction(t);
    setTransactions((prev) => [...prev, t]);
  }

  async function handleDelete(id: string) {
    await apiDeleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleLoadDemo(ts: Transaction[]) {
    await apiLoadDemo(ts);
    setTransactions(ts);
    setPage('dashboard');
  }

  async function handleClear() {
    await apiClearTransactions();
    setTransactions([]);
  }

  function handleSelectRegion(code: string | null) {
    setSelectedRegionCode(code);
    saveRegion(code);
  }

  return (
    <Layout current={page} onChange={setPage} selectedRegionCode={selectedRegionCode}>
      {page === 'dashboard' && (
        <Dashboard
          transactions={transactions}
          inflationData={inflationData}
          categoryWeights={categoryWeights}
          ipcaLoading={ipcaLoading || regionalLoading || txLoading}
          selectedRegionCode={selectedRegionCode}
          onGoToTransactions={() => setPage('transactions')}
          onGoToMyCity={() => setPage('mycity')}
        />
      )}
      {page === 'transactions' && (
        <Transactions
          transactions={transactions}
          onAdd={handleAdd}
          onDelete={handleDelete}
          onLoadDemo={() => handleLoadDemo(DEMO_TRANSACTIONS)}
          onClear={handleClear}
        />
      )}
      {page === 'mycity' && (
        <MyCity
          transactions={transactions}
          inflationData={inflationData}
          categoryWeights={categoryWeights}
          selectedRegionCode={selectedRegionCode}
          hasRegionalData={hasRegionalData}
          onSelect={handleSelectRegion}
          regionalLoading={regionalLoading}
        />
      )}
      {page === 'methodology' && <Methodology />}
    </Layout>
  );
}
