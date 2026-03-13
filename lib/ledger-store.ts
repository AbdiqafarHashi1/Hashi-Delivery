"use client";

import { demoAccountTransactions, demoHistory } from "@/lib/demo-data";
import { computeSellerEntrySummary } from "@/lib/calculations";
import { SellerEntryItemInput } from "@/lib/types";

export type EntryStatus = "open" | "submitted" | "locked" | "reopened" | "reviewed";

export type LedgerEntry = {
  id: string;
  entry_date: string;
  items: SellerEntryItemInput[];
  cash_received: number;
  mpesa_received: number;
  total_sales: number;
  sadio_cut: number;
  handover_amount: number;
  collection_difference: number;
  entry_status: EntryStatus;
  locked_at?: string;
  locked_by?: string;
  reopened_at?: string;
  reopened_by?: string;
  reopen_reason?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  mismatch_resolved_at?: string;
  mismatch_resolved_by?: string;
  mismatch_review_note?: string;
  updated_at: string;
};

export type AuditEvent = {
  id: string;
  event_at: string;
  actor: string;
  action: string;
  notes?: string;
};

export type LedgerTransaction = {
  id: string;
  transaction_date: string;
  account: "cash" | "mpesa";
  amount: number;
  direction: "inflow" | "outflow" | "adjustment";
  adjustment_type?: "credit" | "debit";
  notes: string;
  created_by: string;
};

type LedgerState = {
  entries: LedgerEntry[];
  accountTransactions: LedgerTransaction[];
  auditEvents: AuditEvent[];
};

const STORAGE_KEY = "hashi-ledger-state-v1";

const nowIso = () => new Date().toISOString();
const id = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

const initialState = (): LedgerState => ({
  entries: demoHistory.map((row, index) => ({
    id: row.id,
    entry_date: row.entry_date,
    items: [],
    cash_received: row.cash_received,
    mpesa_received: row.mpesa_received,
    total_sales: row.total_sales,
    sadio_cut: row.sadio_cut,
    handover_amount: row.handover_amount,
    collection_difference: index === 1 ? -140 : 0,
    mismatch_review_note: index === 1 ? "Waiting review note" : undefined,
    entry_status: "submitted" as EntryStatus,
    updated_at: nowIso()
  })),
  accountTransactions: demoAccountTransactions.map((tx) => ({ ...tx, notes: tx.notes || "", created_by: "system" })),
  auditEvents: []
});

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

export const getLedgerState = () => read();

export const saveSellerEntry = ({ date, items, cashReceived, mpesaReceived }: { date: string; items: SellerEntryItemInput[]; cashReceived: number; mpesaReceived: number }) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);

  if (existing && (existing.entry_status === "locked" || existing.entry_status === "submitted" || existing.entry_status === "reviewed")) {
    throw new Error("Entry is not editable. Ask admin to reopen.");
  }

  const computed = computeSellerEntrySummary(items);
  const collectionDifference = Number((cashReceived + mpesaReceived - computed.totalSales).toFixed(2));

  if (collectionDifference !== 0) {
    throw new Error("Collection mismatch must be zero before save.");
  }

  const next: LedgerEntry = {
    id: existing?.id || id(),
    entry_date: date,
    items,
    cash_received: cashReceived,
    mpesa_received: mpesaReceived,
    total_sales: computed.totalSales,
    sadio_cut: computed.sadioCut,
    handover_amount: computed.handoverAmount,
    collection_difference: collectionDifference,
    entry_status: "submitted",
    mismatch_resolved_at: collectionDifference === 0 ? nowIso() : undefined,
    mismatch_resolved_by: collectionDifference === 0 ? "system" : undefined,
    updated_at: nowIso(),
    reopened_at: existing?.reopened_at,
    reopened_by: existing?.reopened_by,
    reopen_reason: existing?.reopen_reason,
    reviewed_at: undefined,
    reviewed_by: undefined,
    locked_at: undefined,
    locked_by: undefined
  };

  state.entries = [next, ...state.entries.filter((entry) => entry.entry_date !== date)];
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor: "Seller", action: "entry.submit", notes: `Submitted ${date}` });
  write(state);
};

export const lockDay = (date: string, actor: string) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  const updated: LedgerEntry = existing
    ? { ...existing, entry_status: "locked", locked_at: nowIso(), locked_by: actor, updated_at: nowIso() }
    : {
        id: id(),
        entry_date: date,
        items: [],
        cash_received: 0,
        mpesa_received: 0,
        total_sales: 0,
        sadio_cut: 0,
        handover_amount: 0,
        collection_difference: 0,
        entry_status: "locked",
        locked_at: nowIso(),
        locked_by: actor,
        updated_at: nowIso()
      };

  state.entries = [updated, ...state.entries.filter((entry) => entry.entry_date !== date)];
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action: "entry.lock", notes: `Locked ${date}` });
  write(state);
};

export const reopenDay = (date: string, actor: string, reason: string) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("No entry/day found for date.");
  const updated: LedgerEntry = {
    ...existing,
    entry_status: "reopened",
    reopened_at: nowIso(),
    reopened_by: actor,
    reopen_reason: reason,
    locked_at: undefined,
    locked_by: undefined,
    updated_at: nowIso()
  };
  state.entries = [updated, ...state.entries.filter((entry) => entry.entry_date !== date)];
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action: "entry.reopen", notes: `${date}: ${reason}` });
  write(state);
};

export const reviewDay = (date: string, actor: string) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("No entry/day found for date.");
  const updated: LedgerEntry = { ...existing, entry_status: "reviewed", reviewed_at: nowIso(), reviewed_by: actor, updated_at: nowIso() };
  state.entries = [updated, ...state.entries.filter((entry) => entry.entry_date !== date)];
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action: "entry.review", notes: `Reviewed ${date}` });
  write(state);
};

export const postManualAdjustment = ({ account, adjustmentType, amount, reason, actor }: { account: "cash" | "mpesa"; adjustmentType: "credit" | "debit"; amount: number; reason: string; actor: string }) => {
  const state = read();
  const signedAmount = adjustmentType === "credit" ? amount : -amount;
  const tx: LedgerTransaction = {
    id: id(),
    transaction_date: new Date().toISOString().slice(0, 10),
    account,
    amount: signedAmount,
    direction: "adjustment",
    adjustment_type: adjustmentType,
    notes: reason,
    created_by: actor
  };
  state.accountTransactions.unshift(tx);
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action: "account.adjustment", notes: `${account} ${adjustmentType} ${amount}` });
  write(state);
};

export const resolveMismatch = ({ date, actor, note }: { date: string; actor: string; note: string }) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("Entry not found.");
  const updated = {
    ...existing,
    mismatch_resolved_at: nowIso(),
    mismatch_resolved_by: actor,
    mismatch_review_note: note,
    updated_at: nowIso()
  };
  state.entries = [updated, ...state.entries.filter((entry) => entry.entry_date !== date)];
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action: "mismatch.resolve", notes: `${date}: ${note}` });
  write(state);
};

export const reopenMismatch = ({ date, actor, note }: { date: string; actor: string; note: string }) => {
  const state = read();
  const existing = state.entries.find((entry) => entry.entry_date === date);
  if (!existing) throw new Error("Entry not found.");
  const updated = {
    ...existing,
    mismatch_resolved_at: undefined,
    mismatch_resolved_by: undefined,
    mismatch_review_note: note,
    updated_at: nowIso()
  };
  state.entries = [updated, ...state.entries.filter((entry) => entry.entry_date !== date)];
  state.auditEvents.unshift({ id: id(), event_at: nowIso(), actor, action: "mismatch.reopen", notes: `${date}: ${note}` });
  write(state);
};
