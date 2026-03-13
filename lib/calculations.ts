import { AccountOwner, AccountTransaction, DailyEntryItemInput, DailyFinancialSummary, SellerEntryComputed, SellerEntryItemInput } from "@/lib/types";

const clampMoney = (value: number) => Number(value.toFixed(2));

export const computeDailyFinancials = (items: DailyEntryItemInput[]): DailyFinancialSummary => {
  const totalSales = items.reduce((sum, row) => sum + row.quantity * row.sellingPrice, 0);
  const totalCogs = items.reduce((sum, row) => sum + row.quantity * row.unitCost, 0);
  const netProfit = totalSales - totalCogs;

  return {
    total_sales: clampMoney(totalSales),
    total_cogs: clampMoney(totalCogs),
    net_profit: clampMoney(netProfit),
    restaurant_share: clampMoney(netProfit * 0.5),
    abdiqafar_share: clampMoney(netProfit * 0.25),
    shafie_share: clampMoney(netProfit * 0.25)
  };
};

export const computeSellerEntrySummary = (items: SellerEntryItemInput[]): SellerEntryComputed => {
  const totalSales = items.reduce((sum, row) => sum + row.quantity * row.sellingPrice, 0);
  const sellerCommission = items.reduce((sum, row) => sum + row.quantity * row.commission, 0);
  const handoverAmount = totalSales - sellerCommission;

  return {
    totalSales: clampMoney(totalSales),
    sellerCommission: clampMoney(sellerCommission),
    handoverAmount: clampMoney(handoverAmount)
  };
};

export const computeMonthlySummary = (daily: DailyFinancialSummary[]) => {
  const totals = daily.reduce(
    (acc, row) => {
      acc.total_sales += row.total_sales;
      acc.total_cogs += row.total_cogs;
      acc.net_profit += row.net_profit;
      return acc;
    },
    { total_sales: 0, total_cogs: 0, net_profit: 0 }
  );

  return {
    total_sales: clampMoney(totals.total_sales),
    total_cogs: clampMoney(totals.total_cogs),
    net_profit: clampMoney(totals.net_profit),
    restaurant_share: clampMoney(totals.net_profit * 0.5),
    abdiqafar_share: clampMoney(totals.net_profit * 0.25),
    shafie_share: clampMoney(totals.net_profit * 0.25)
  };
};

export const computeAccountBalances = (transactions: AccountTransaction[]) => {
  const balances: Record<AccountOwner, number> = { restaurant: 0, abdiqafar: 0, shafie: 0 };

  for (const tx of transactions) {
    const multiplier = tx.direction === "outflow" ? -1 : 1;
    balances[tx.account_owner] += tx.amount * multiplier;
  }

  return {
    restaurant: clampMoney(balances.restaurant),
    abdiqafar: clampMoney(balances.abdiqafar),
    shafie: clampMoney(balances.shafie)
  };
};
