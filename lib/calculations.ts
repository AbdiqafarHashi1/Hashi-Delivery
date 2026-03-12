import { AccountTransaction, DailyEntryComputed, DailyEntryItemInput, SellerEntryComputed, SellerEntryItemInput } from "@/lib/types";

const clampMoney = (value: number) => Number(value.toFixed(2));

export const computeDailyEntry = (items: DailyEntryItemInput[]): DailyEntryComputed => {
  const totalSales = items.reduce((sum, row) => sum + row.quantity * row.sellingPrice, 0);
  const sadioCut = items.reduce((sum, row) => sum + row.quantity * row.commission, 0);
  const postCommissionPool = totalSales - sadioCut;
  const restaurantGrossShare = postCommissionPool * 0.5;
  const partnerGrossShare = postCommissionPool * 0.5;
  const totalCogs = items.reduce((sum, row) => sum + row.quantity * row.unitCost, 0);
  const restaurantNetShare = restaurantGrossShare - totalCogs;
  const partnerFinalShare = partnerGrossShare;
  const handoverAmount = totalSales - sadioCut;

  return {
    totalSales: clampMoney(totalSales),
    sadioCut: clampMoney(sadioCut),
    postCommissionPool: clampMoney(postCommissionPool),
    restaurantGrossShare: clampMoney(restaurantGrossShare),
    partnerGrossShare: clampMoney(partnerGrossShare),
    totalCogs: clampMoney(totalCogs),
    restaurantNetShare: clampMoney(restaurantNetShare),
    partnerFinalShare: clampMoney(partnerFinalShare),
    handoverAmount: clampMoney(handoverAmount)
  };
};

export const computeSellerEntrySummary = (items: SellerEntryItemInput[]): SellerEntryComputed => {
  const totalSales = items.reduce((sum, row) => sum + row.quantity * row.sellingPrice, 0);
  const sadioCut = items.reduce((sum, row) => sum + row.quantity * row.commission, 0);
  const handoverAmount = totalSales - sadioCut;

  return {
    totalSales: clampMoney(totalSales),
    sadioCut: clampMoney(sadioCut),
    handoverAmount: clampMoney(handoverAmount)
  };
};

export const computeAccountBalances = (transactions: AccountTransaction[]) => {
  const balances = { cash: 0, mpesa: 0 };

  for (const tx of transactions) {
    const multiplier = tx.direction === "outflow" ? -1 : 1;
    balances[tx.account] += tx.amount * multiplier;
  }

  return {
    cash: clampMoney(balances.cash),
    mpesa: clampMoney(balances.mpesa),
    total: clampMoney(balances.cash + balances.mpesa)
  };
};
