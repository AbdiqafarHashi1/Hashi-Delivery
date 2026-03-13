"use client";

import { useEffect, useState } from "react";
import { SellerEntryForm } from "@/components/seller-entry-form";
import { getActiveSellerItems } from "@/lib/ledger-store";
import { SellerVisibleItem } from "@/lib/types";

export function SellerEntryPageClient() {
  const [items, setItems] = useState<SellerVisibleItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getActiveSellerItems());
    sync();
    window.addEventListener("ledger-state-updated", sync);
    return () => window.removeEventListener("ledger-state-updated", sync);
  }, []);

  return <SellerEntryForm items={items} />;
}
