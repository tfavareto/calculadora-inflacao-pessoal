import { Transaction } from './types';

const KEY_TRANSACTIONS = 'inflacao_pessoal_transactions';
const KEY_REGION       = 'inflacao_pessoal_region';

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEY_TRANSACTIONS);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(KEY_TRANSACTIONS, JSON.stringify(transactions));
}

export function loadRegion(): string | null {
  return localStorage.getItem(KEY_REGION);
}

export function saveRegion(ibgeCode: string | null): void {
  if (ibgeCode) localStorage.setItem(KEY_REGION, ibgeCode);
  else localStorage.removeItem(KEY_REGION);
}
