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

export type DailyEntryComputed = {
  totalSales: number;
  sadioCut: number;
  postCommissionPool: number;
  restaurantGrossShare: number;
  partnerGrossShare: number;
  totalCogs: number;
  restaurantNetShare: number;
  partnerFinalShare: number;
  handoverAmount: number;
};

export type SellerEntryComputed = {
  totalSales: number;
  sadioCut: number;
  handoverAmount: number;
};

export type AccountType = "cash" | "mpesa";

export type AccountTransaction = {
  id: string;
  account: AccountType;
  amount: number;
  direction: "inflow" | "outflow" | "adjustment";
  transaction_date: string;
  notes?: string;
};
