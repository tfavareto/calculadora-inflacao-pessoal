export type TransactionType = 'expense' | 'income';

export type IPCACategory =
  | 'alimentacao_bebidas'
  | 'moradia'
  | 'artigos_residencia'
  | 'vestuario'
  | 'transportes'
  | 'saude_cuidados'
  | 'despesas_pessoais'
  | 'educacao'
  | 'comunicacao';

export interface Transaction {
  id: string;
  date: string;       // YYYY-MM-DD
  description: string;
  category: IPCACategory;
  type: TransactionType;
  amount: number;
}

export interface InflationPoint {
  month: string;       // YYYY-MM
  label: string;       // "Jan/24"
  personalMonthly: number;
  personalAccumulated: number;
  ipcaMonthly: number;
  ipcaAccumulated: number;
}

export interface CategoryWeight {
  category: IPCACategory;
  label: string;
  weight: number;      // 0–1
  baseSpend: number;
  color: string;
  emoji: string;
}

export type PageKey = 'dashboard' | 'transactions' | 'methodology' | 'mycity' | 'inflation';
