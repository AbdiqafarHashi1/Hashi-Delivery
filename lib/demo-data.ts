import { AccountTransaction, Item } from "@/lib/types";

export const defaultItems: Item[] = [
  { id: "wrap", name: "Wrap", selling_price: 450, unit_cost: 180, seller_commission: 45, is_active: true },
  { id: "samosa", name: "Samosa", selling_price: 80, unit_cost: 30, seller_commission: 8, is_active: true },
  { id: "tea", name: "Tea", selling_price: 120, unit_cost: 45, seller_commission: 10, is_active: true },
  { id: "coffee", name: "Coffee", selling_price: 150, unit_cost: 55, seller_commission: 12, is_active: true }
];

export const demoHistory = [
  { id: "1", entry_date: "2026-03-10", total_sales: 7240, total_cogs: 2885, net_profit: 4355, cash_received: 4900, mpesa_received: 2340 },
  { id: "2", entry_date: "2026-03-11", total_sales: 6810, total_cogs: 2710, net_profit: 4100, cash_received: 4000, mpesa_received: 2810 }
];

export const demoAccountTransactions: AccountTransaction[] = [
  { id: "t1", account_owner: "restaurant", amount: 2177.5, direction: "inflow", transaction_date: "2026-03-10", notes: "Daily share" },
  { id: "t2", account_owner: "abdiqafar", amount: 1088.75, direction: "inflow", transaction_date: "2026-03-10", notes: "Daily share" },
  { id: "t3", account_owner: "shafie", amount: 1088.75, direction: "inflow", transaction_date: "2026-03-10", notes: "Daily share" }
];
