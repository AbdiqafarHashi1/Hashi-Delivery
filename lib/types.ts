export type AppRole = "admin" | "data_entry";

export type Item = {
  id: string;
  name: string;
  selling_price: number;
  unit_cost: number;
  seller_commission: number;
  is_active: boolean;
};

export type SellerVisibleItem = Pick<Item, "id" | "name" | "selling_price" | "seller_commission">;

export type DailyEntryItemInput = {
  itemId: string;
  itemName: string;
  quantity: number;
  sellingPrice: number;
  unitCost: number;
  commission: number;
};

export type SellerEntryItemInput = {
  itemId: string;
  itemName: string;
  quantity: number;
  sellingPrice: number;
  commission: number;
};

export type DailyFinancialSummary = {
  total_sales: number;
  total_cogs: number;
  net_profit: number;
  restaurant_share: number;
  abdiqafar_share: number;
  shafie_share: number;
};

export type SellerEntryComputed = {
  totalSales: number;
  sellerCommission: number;
  handoverAmount: number;
};

export type AccountOwner = "restaurant" | "abdiqafar" | "shafie";

export type AccountTransaction = {
  id: string;
  account_owner: AccountOwner;
  amount: number;
  direction: "inflow" | "outflow" | "adjustment";
  transaction_date: string;
  notes?: string;
};
