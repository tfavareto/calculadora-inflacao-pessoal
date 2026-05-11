import { useState, useEffect, useCallback } from 'react';
import { Transaction, InflationPoint, CategoryWeight, PageKey } from './types';
import { loadTransactions, saveTransactions, loadRegion, saveRegion } from './storage';
import { calculateInflation, getCategoryWeights } from './calculator';
import { fetchIPCARange } from './ibgeApi';
import { fetchIPCARegional } from './ibgeRegionalApi';
import { FALLBACK_IPCA } from './constants';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Methodology from './pages/Methodology';
import MyCity from './pages/MyCity';

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());

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

  // Persiste transações
  useEffect(() => { saveTransactions(transactions); }, [transactions]);

  // Recalcula inflação quando dados mudam
  useEffect(() => {
    setInflationData(calculateInflation(transactions, activeIpca));
    setCategoryWeights(getCategoryWeights(transactions));
  }, [transactions, activeIpca]);

  // Fetch IPCA nacional
  const refreshNationalIPCA = useCallback(async () => {
    setIpcaLoading(true);
    const data = await fetchIPCARange('202201', '202512');
    setNationalIpca(data);
    setIpcaLoading(false);
  }, []);

  // Fetch IPCA regional
  const refreshRegionalIPCA = useCallback(async (code: string) => {
    setRegionalLoading(true);
    const data = await fetchIPCARegional(code, '202201', '202512');
    setRegionalIpca(data);
    setRegionalLoading(false);
  }, []);

  useEffect(() => { refreshNationalIPCA(); }, [refreshNationalIPCA]);

  useEffect(() => {
    if (selectedRegionCode) refreshRegionalIPCA(selectedRegionCode);
    else setRegionalIpca({});
  }, [selectedRegionCode, refreshRegionalIPCA]);

  // Handlers
  function handleAdd(t: Transaction) { setTransactions((prev) => [...prev, t]); }
  function handleDelete(id: string) { setTransactions((prev) => prev.filter((t) => t.id !== id)); }
  function handleLoadDemo(ts: Transaction[]) { setTransactions(ts); setPage('dashboard'); }
  function handleClear() { setTransactions([]); }

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
          ipcaLoading={ipcaLoading || regionalLoading}
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
          onLoadDemo={handleLoadDemo}
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
