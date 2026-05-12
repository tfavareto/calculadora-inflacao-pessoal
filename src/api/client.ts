/**
 * API client — todas as chamadas ao backend Express.
 * Em desenvolvimento (Vite proxy) e em produção, a base é sempre '/api'.
 */
import type { Transaction } from '../types';
import { FALLBACK_IPCA } from '../constants';

const BASE = '/api';

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

/* ── Transactions ────────────────────────────────────────── */

export async function apiGetTransactions(): Promise<Transaction[]> {
  try {
    return await apiFetch<Transaction[]>('/transactions');
  } catch (e) {
    console.warn('[API] getTransactions:', e);
    return [];
  }
}

export async function apiAddTransaction(t: Transaction): Promise<void> {
  await apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(t),
  });
}

export async function apiDeleteTransaction(id: string): Promise<void> {
  await apiFetch(`/transactions/${id}`, { method: 'DELETE' });
}

export async function apiClearTransactions(): Promise<void> {
  await apiFetch('/transactions', { method: 'DELETE' });
}

export async function apiLoadDemo(transactions: Transaction[]): Promise<void> {
  await apiFetch('/transactions/demo', {
    method: 'POST',
    body: JSON.stringify({ transactions }),
  });
}

/* ── IPCA ────────────────────────────────────────────────── */

export async function apiGetNationalIPCA(
  start: string,
  end: string,
): Promise<Record<string, number>> {
  try {
    return await apiFetch<Record<string, number>>(
      `/ipca/national?start=${start}&end=${end}`,
    );
  } catch (e) {
    console.warn('[API] getNationalIPCA:', e);
    return FALLBACK_IPCA;
  }
}

export async function apiGetRegionalIPCA(
  ibgeCode: string,
  start: string,
  end: string,
): Promise<Record<string, number>> {
  try {
    return await apiFetch<Record<string, number>>(
      `/ipca/regional/${ibgeCode}?start=${start}&end=${end}`,
    );
  } catch (e) {
    console.warn('[API] getRegionalIPCA:', e);
    return {};
  }
}
