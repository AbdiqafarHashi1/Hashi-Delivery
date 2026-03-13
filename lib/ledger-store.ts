"use client";

import { computeDailyFinancials, computeMonthlySummary } from "@/lib/calculations";
import { defaultItems, demoHistory } from "@/lib/demo-data";
import { DailyEntryItemInput, Item, SellerEntryItemInput } from "@/lib/types";

export type EntryStatus = "open" | "submitted" | "locked" | "reopened" | "reviewed";
export type AccountOwner = "restaurant" | "abdiqafar" | "shafie";

export type LedgerEntry = {
  id: string;
  entry_date: string;
  seller: string;
  items: DailyEntryItemInput[];
  cash_received: number;
  mpesa_received: number;
  total_sales: number;
  total_cogs: number;
  net_profit: number;
  restaurant_share: number;
  abdiqafar_share: number;
  shafie_share: number;
  seller_commission: number;
  handover_amount: number;
  collection_difference: number;
  entry_status: EntryStatus;
  mismatch_resolved_at?: string;
  mismatch_resolved_by?: string;
  mismatch_review_note?: string;
  updated_at: string;
};

export type AccountLedgerTransaction = {
  id: string;
  account_owner: AccountOwner;
  transaction_date: string;
  amount: number;
  direction: "inflow" | "outflow" | "adjustment";
  notes: string;
  created_by: string;
};

export type RestaurantExpense = {
  id: string;
  expense_date: string;
  category: string;
  amount: number;
  notes?: string;
  created_by: string;
};

export type AuditEvent = {
  id: string;
  event_at: string;
  actor: string;
  action: string;
  entity: string;
  before?: string;
  after?: string;
};

type LedgerState = {
  items: Item[];
  entries: LedgerEntry[];
  accountTransactions: AccountLedgerTransaction[];
  restaurantExpenses: RestaurantExpense[];
  auditEvents: AuditEvent[];
};

const STORAGE_KEY = "hashi-ledger-state-v2";
const nowIso = () => new Date().toISOString();
const id = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const money = (n: number) => Number(n.toFixed(2));

const initialState = (): LedgerState => {
  const entries: LedgerEntry[] = demoHistory.map((row, index) => ({
    id: row.id,
    entry_date: row.entry_date,
    seller: "Seller",
    items: [],
    cash_received: row.cash_received,
    mpesa_received: row.mpesa_received,
    total_sales: row.total_sales,
    total_cogs: row.total_cogs,
    net_profit: row.net_profit,
    restaurant_share: money(row.net_profit * 0.5),
    abdiqafar_share: money(row.net_profit * 0.25),
    shafie_share: money(row.net_profit * 0.25),
    seller_commission: 0,
    handover_amount: row.total_sales,
    collection_difference: index === 1 ? -140 : 0,
    mismatch_review_note: index === 1 ? "Waiting review note" : undefined,
    entry_status: "submitted",
    updated_at: nowIso()
  }));

  const accountTransactions: AccountLedgerTransaction[] = entries.flatMap((entry) => [
    { id: id(), account_owner: "restaurant", transaction_date: entry.entry_date, amount: entry.restaurant_share, direction: "inflow", notes: `Profit share ${entry.entry_date}`, created_by: "system" },
    { id: id(), account_owner: "abdiqafar", transaction_date: entry.entry_date, amount: entry.abdiqafar_share, direction: "inflow", notes: `Profit share ${entry.entry_date}`, created_by: "system" },
    { id: id(), account_owner: "shafie", transaction_date: entry.entry_date, amount: entry.shafie_share, direction: "inflow", notes: `Profit share ${entry.entry_date}`, created_by: "system" }
  ]);

  return { items: defaultItems, entries, accountTransactions, restaurantExpenses: [], auditEvents: [] };
};

const read = (): LedgerState => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialState();
  try {
    return JSON.parse(raw) as LedgerState;
  } catch {
    return initialState();
  }
};

const write = (state: LedgerState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("ledger-state-updated"));
};

const addAudit = (state: LedgerState, actor: string, action: string, entity: string, before?: string, after?: string) => {
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action, entity, before, after });
};

export const getLedgerState = () => read();
export const getActiveSellerItems = () => read().items.filter((item) => item.is_active).map((item) => ({ id: item.id, name: item.name, selling_price: item.selling_price, seller_commission: item.seller_commission }));

export const saveSellerEntry = ({ date, items, cashReceived, mpesaReceived, actor = "Seller" }: { date: string; items: SellerEntryItemInput[]; cashReceived: number; mpesaReceived: number; actor?: string }) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (existing && ["locked", "submitted", "reviewed"].includes(existing.entry_status)) throw new Error("Entry is not editable. Ask admin to reopen.");

  const itemsWithCost = items.map((row) => {
    const item = state.items.find((i) => i.id === row.itemId);
    return { ...row, unitCost: item?.unit_cost ?? 0 };
  });
  const fin = computeDailyFinancials(itemsWithCost);
  const sellerCommission = money(items.reduce((sum, row) => sum + row.quantity * row.commission, 0));
  const handoverAmount = money(fin.total_sales - sellerCommission);
  const collectionDifference = money(cashReceived + mpesaReceived - fin.total_sales);

  const next: LedgerEntry = {
    id: existing?.id || id(),
    entry_date: date,
    seller: actor,
    items: itemsWithCost,
    cash_received: cashReceived,
    mpesa_received: mpesaReceived,
    total_sales: fin.total_sales,
    total_cogs: fin.total_cogs,
    net_profit: fin.net_profit,
    restaurant_share: fin.restaurant_share,
    abdiqafar_share: fin.abdiqafar_share,
    shafie_share: fin.shafie_share,
    seller_commission: sellerCommission,
    handover_amount: handoverAmount,
    collection_difference: collectionDifference,
    entry_status: "submitted",
    mismatch_resolved_at: collectionDifference === 0 ? nowIso() : undefined,
    mismatch_resolved_by: collectionDifference === 0 ? "system" : undefined,
    updated_at: nowIso()
  };

  state.entries = [next, ...state.entries.filter((entry) => entry.entry_date !== date)];

  state.accountTransactions = state.accountTransactions.filter((tx) => !(tx.notes.startsWith("Profit share") && tx.notes.endsWith(date)));
  state.accountTransactions.unshift(
    { id: id(), account_owner: "restaurant", transaction_date: date, amount: next.restaurant_share, direction: "inflow", notes: `Profit share ${date}`, created_by: "system" },
    { id: id(), account_owner: "abdiqafar", transaction_date: date, amount: next.abdiqafar_share, direction: "inflow", notes: `Profit share ${date}`, created_by: "system" },
    { id: id(), account_owner: "shafie", transaction_date: date, amount: next.shafie_share, direction: "inflow", notes: `Profit share ${date}`, created_by: "system" }
  );

  addAudit(state, actor, "entry.submit", "daily_entry", existing ? "updated" : "created", `date ${date}`);
  write(state);
};

export const upsertItem = (payload: Omit<Item, "id"> & { id?: string }, actor: string) => {
  const state = read();
  const existing = payload.id ? state.items.find((item) => item.id === payload.id) : undefined;

  if (existing) {
    const before = JSON.stringify(existing);
    Object.assign(existing, payload);
    addAudit(state, actor, "item.update", "item", before, JSON.stringify(existing));
  } else {
    const created = { ...payload, id: id() } as Item;
    state.items.unshift(created);
    addAudit(state, actor, "item.create", "item", undefined, JSON.stringify(created));
  }
  write(state);
};

export const addRestaurantExpense = ({ expense_date, category, amount, notes, actor }: { expense_date: string; category: string; amount: number; notes?: string; actor: string }) => {
  const state = read();
  const expense: RestaurantExpense = { id: id(), expense_date, category, amount, notes, created_by: actor };
  state.restaurantExpenses.unshift(expense);
  state.accountTransactions.unshift({ id: id(), account_owner: "restaurant", transaction_date: expense_date, amount, direction: "outflow", notes: notes || category, created_by: actor });
  addAudit(state, actor, "expense.create", "restaurant_expense", undefined, JSON.stringify(expense));
  write(state);
};

export const postAccountTransaction = ({ account_owner, direction, amount, notes, actor }: { account_owner: AccountOwner; direction: "outflow" | "adjustment"; amount: number; notes: string; actor: string }) => {
  const state = read();
  const tx: AccountLedgerTransaction = { id: id(), account_owner, transaction_date: new Date().toISOString().slice(0, 10), amount, direction, notes, created_by: actor };
  state.accountTransactions.unshift(tx);
  addAudit(state, actor, "account.adjustment", "account_transaction", undefined, JSON.stringify(tx));
  write(state);
};

export const lockDay = (date: string, actor: string) => updateStatus(date, "locked", actor);
export const reviewDay = (date: string, actor: string) => updateStatus(date, "reviewed", actor);
export const reopenDay = (date: string, actor: string, reason: string) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("No entry/day found for date.");
  existing.entry_status = "reopened";
  existing.mismatch_review_note = reason;
  existing.updated_at = nowIso();
  addAudit(state, actor, "entry.reopen", "daily_entry", undefined, `${date} ${reason}`);
  write(state);
};

const updateStatus = (date: string, status: EntryStatus, actor: string) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("No entry/day found for date.");
  existing.entry_status = status;
  existing.updated_at = nowIso();
  addAudit(state, actor, `entry.${status}`, "daily_entry", undefined, date);
  write(state);
};

export const resolveMismatch = ({ date, actor, note }: { date: string; actor: string; note: string }) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("Entry not found.");
  existing.mismatch_resolved_at = nowIso();
  existing.mismatch_resolved_by = actor;
  existing.mismatch_review_note = note;
  existing.updated_at = nowIso();
  addAudit(state, actor, "mismatch.resolve", "daily_entry", undefined, `${date} ${note}`);
  write(state);
};

export const reopenMismatch = ({ date, actor, note }: { date: string; actor: string; note: string }) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("Entry not found.");
  existing.mismatch_resolved_at = undefined;
  existing.mismatch_resolved_by = undefined;
  existing.mismatch_review_note = note;
  existing.updated_at = nowIso();
  addAudit(state, actor, "mismatch.reopen", "daily_entry", undefined, `${date} ${note}`);
  write(state);
};

export const getMonthlySummary = (month: string) => {
  const rows = read().entries.filter((entry) => entry.entry_date.startsWith(month)).map((entry) => ({
    total_sales: entry.total_sales,
    total_cogs: entry.total_cogs,
    net_profit: entry.net_profit,
    restaurant_share: entry.restaurant_share,
    abdiqafar_share: entry.abdiqafar_share,
    shafie_share: entry.shafie_share
  }));
  return computeMonthlySummary(rows);
};
