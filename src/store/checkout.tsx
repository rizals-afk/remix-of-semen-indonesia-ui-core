import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ADDRESSES, PAYMENT_METHODS, WAREHOUSES, ESTIMATED_GROUP_SHIPPING_FEE,
  type Address, type PaymentMethod, type Voucher, type Warehouse,
} from "@/data/shopping";

export type FulfillmentMode = "dikirim" | "diambil";
export type CheckoutStage = "draft" | "verifying" | "verified" | "paid";

export interface BuyNowItem {
  productId: string;
  variantId: string;
  branchId: string;
  name: string;
  variantName: string;
  price: number;
  qty: number;
  image: string;
  warehouse: string;
  weightKg: number;
  /** Division from selected product variant */
  division?: string;
  /** Branch latitude from selected product branch */
  branch_latitude?: number;
  /** Branch longitude from selected product branch */
  branch_longitude?: number;
}

interface CheckoutState {
  mode: FulfillmentMode;
  setMode: (m: FulfillmentMode) => void;
  address: Address;
  setAddress: (a: Address) => void;
  warehouse: Warehouse;
  setWarehouse: (w: Warehouse) => void;
  voucher: Voucher | null;
  setVoucher: (v: Voucher | null) => void;
  payment: PaymentMethod | null;
  setPayment: (p: PaymentMethod | null) => void;
  /** Per-warehouse note (key: warehouse name). */
  notes: Record<string, string>;
  setNote: (warehouse: string, text: string) => void;
  /** COD toggle, only relevant when mode === "diambil". */
  cod: boolean;
  setCod: (v: boolean) => void;
  /** Per-warehouse shipping fee, filled-in by admin after verification. */
  groupShippingFees: Record<string, number>;
  setGroupShippingFee: (warehouse: string, fee: number) => void;
  /** Estimated total shipping fee shown on the checkout screen (pre-verification). */
  estimatedShippingFor: (warehouseCount: number) => number;
  /** Current stage in the request → verify → pay flow. */
  stage: CheckoutStage;
  setStage: (s: CheckoutStage) => void;
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  submitOrder: (warehouses: string[]) => string;
  markVerified: (warehouses: string[]) => void;
  /** Single item for Buy Now flow (bypasses cart). */
  buyNowItem: BuyNowItem | null;
  setBuyNowItem: (item: BuyNowItem | null) => void;
  clearBuyNowItem: () => void;
}

const CheckoutContext = createContext<CheckoutState | null>(null);
const BUY_NOW_STORAGE_KEY = "bm_buy_now_item";

function makeOrderId() {
  const d = new Date();
  const datePart = `${String(d.getDate()).padStart(2, "0")}${String(d.getMonth() + 1).padStart(2, "0")}${d.getFullYear()}`;
  const rand = Math.floor(Math.random() * 900000 + 100000);
  return `ORD-${datePart}-${rand}`;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FulfillmentMode>("dikirim");
  const [address, setAddress] = useState<Address>(ADDRESSES[0]);
  const [warehouse, setWarehouse] = useState<Warehouse>(WAREHOUSES[0]);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | null>(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [cod, setCod] = useState(false);
  const [groupShippingFees, setGroupShippingFees] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<CheckoutStage>("draft");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [buyNowItem, setBuyNowItemState] = useState<BuyNowItem | null>(null);

  // Load buyNowItem from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(BUY_NOW_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BuyNowItem;
        setBuyNowItemState(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  // Persist buyNowItem to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (buyNowItem) {
      window.localStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(buyNowItem));
    } else {
      window.localStorage.removeItem(BUY_NOW_STORAGE_KEY);
    }
  }, [buyNowItem]);

  const setNote = useCallback((wh: string, text: string) => {
    setNotes((s) => ({ ...s, [wh]: text }));
  }, []);

  const setGroupShippingFee = useCallback((wh: string, fee: number) => {
    setGroupShippingFees((s) => ({ ...s, [wh]: fee }));
  }, []);

  const submitOrder = useCallback((warehouses: string[]) => {
    const id = makeOrderId();
    setOrderId(id);
    setStage("verifying");
    // Reset fees so verification can populate them.
    setGroupShippingFees(Object.fromEntries(warehouses.map((w) => [w, 0])));
    return id;
  }, []);

  const markVerified = useCallback((warehouses: string[]) => {
    setGroupShippingFees(Object.fromEntries(warehouses.map((w) => [w, ESTIMATED_GROUP_SHIPPING_FEE])));
    setStage("verified");
  }, []);

  const clearBuyNowItem = useCallback(() => {
    setBuyNowItemState(null);
  }, []);

  const setBuyNowItem = useCallback((item: BuyNowItem | null) => {
    setBuyNowItemState(item);
  }, []);

  const value = useMemo<CheckoutState>(() => ({
    mode, setMode, address, setAddress, warehouse, setWarehouse,
    voucher, setVoucher, payment, setPayment,
    notes, setNote, cod, setCod,
    groupShippingFees, setGroupShippingFee,
    estimatedShippingFor: (n) => (mode === "dikirim" ? n * ESTIMATED_GROUP_SHIPPING_FEE * 2 : 0),
    stage, setStage, orderId, setOrderId,
    submitOrder, markVerified,
    buyNowItem, setBuyNowItem, clearBuyNowItem,
  }), [mode, address, warehouse, voucher, payment, notes, setNote, cod, groupShippingFees, setGroupShippingFee, stage, orderId, submitOrder, markVerified, buyNowItem, clearBuyNowItem]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}
