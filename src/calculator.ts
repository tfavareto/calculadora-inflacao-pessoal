import { Transaction, InflationPoint, CategoryWeight, IPCACategory } from './types';
import { CATEGORIES, MONTH_NAMES_SHORT } from './constants';

type MonthExpenses = Partial<Record<IPCACategory, number>>;

function groupExpensesByMonth(transactions: Transaction[]): Record<string, MonthExpenses> {
  const result: Record<string, MonthExpenses> = {};
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!result[month]) result[month] = {};
    result[month][t.category] = (result[month][t.category] ?? 0) + t.amount;
  }
  return result;
}

function monthLabel(yyyymm: string): string {
  const [year, mon] = yyyymm.split('-');
  return `${MONTH_NAMES_SHORT[parseInt(mon) - 1]}/${year.slice(2)}`;
}

export function calculateInflation(
  transactions: Transaction[],
  ipcaData: Record<string, number>,
): InflationPoint[] {
  const byMonth = groupExpensesByMonth(transactions);
  const months = Object.keys(byMonth).sort();
  if (months.length < 2) return [];

  const base = months[0];
  const baseExpenses = byMonth[base];
  const baseTotal = (Object.values(baseExpenses) as number[]).reduce((s, v) => s + v, 0);
  if (baseTotal === 0) return [];

  // Fixed base-period weights (Laspeyres-type)
  const weights: Partial<Record<IPCACategory, number>> = {};
  for (const [cat, spend] of Object.entries(baseExpenses) as [IPCACategory, number][]) {
    if (spend > 0) weights[cat] = spend / baseTotal;
  }

  // Personal Price Index per month (base = 100)
  const ppi: Record<string, number> = { [base]: 100 };
  for (let i = 1; i < months.length; i++) {
    const m = months[i];
    const cur = byMonth[m];
    let weightedRatio = 0;
    let usedWeight = 0;
    for (const [cat, w] of Object.entries(weights) as [IPCACategory, number][]) {
      const curVal = cur[cat] ?? 0;
      const baseVal = baseExpenses[cat] ?? 0;
      if (baseVal > 0 && curVal > 0) {
        weightedRatio += w * (curVal / baseVal);
        usedWeight += w;
      }
    }
    // Re-normalize to handle missing categories in a given month
    ppi[m] = usedWeight > 0 ? 100 * (weightedRatio / usedWeight) : ppi[months[i - 1]];
  }

  // Build result series
  let ipcaFactor = 1;
  return months.map((m, idx) => {
    const prevM = idx > 0 ? months[idx - 1] : m;
    const personalMonthly = idx === 0 ? 0 : (ppi[m] / ppi[prevM] - 1) * 100;
    const personalAccumulated = (ppi[m] / 100 - 1) * 100;

    const ipcaKey = m.replace('-', '');
    const ipcaMonthly = idx === 0 ? 0 : (ipcaData[ipcaKey] ?? 0);
    if (idx > 0) ipcaFactor *= 1 + ipcaMonthly / 100;
    const ipcaAccumulated = (ipcaFactor - 1) * 100;

    return {
      month: m,
      label: monthLabel(m),
      personalMonthly: +personalMonthly.toFixed(2),
      personalAccumulated: +personalAccumulated.toFixed(2),
      ipcaMonthly: +ipcaMonthly.toFixed(2),
      ipcaAccumulated: +ipcaAccumulated.toFixed(2),
    };
  });
}

export function getCategoryWeights(transactions: Transaction[]): CategoryWeight[] {
  const byMonth = groupExpensesByMonth(transactions);
  const months = Object.keys(byMonth).sort();
  if (months.length === 0) return [];

  const base = months[0];
  const baseExpenses = byMonth[base];
  const baseTotal = (Object.values(baseExpenses) as number[]).reduce((s, v) => s + v, 0);
  if (baseTotal === 0) return [];

  return (Object.keys(CATEGORIES) as IPCACategory[])
    .map((cat) => ({
      category: cat,
      label: CATEGORIES[cat].label,
      weight: (baseExpenses[cat] ?? 0) / baseTotal,
      baseSpend: baseExpenses[cat] ?? 0,
      color: CATEGORIES[cat].color,
      emoji: CATEGORIES[cat].emoji,
    }))
    .filter((c) => c.baseSpend > 0)
    .sort((a, b) => b.weight - a.weight);
}

export function getSummary(transactions: Transaction[]) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const incomes = transactions.filter((t) => t.type === 'income');
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);

  const dates = transactions.map((t) => t.date).sort();
  const firstDate = dates[0] ?? null;
  const lastDate = dates[dates.length - 1] ?? null;

  return { totalExpense, totalIncome, firstDate, lastDate };
}
