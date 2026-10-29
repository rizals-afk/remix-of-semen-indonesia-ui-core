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
  vouchers: Voucher[];
  setVouchers: (v: Voucher[]) => void;
  addVoucher: (v: Voucher) => void;
  removeVoucher: (voucherId: string) => void;
  /** Backward compatibility: single voucher (first in array) */
  voucher: Voucher | null;
  /** Backward compatibility: set single voucher (replaces all) */
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
  /** Per-warehouse delivery rule ID from shipping calculation. */
  deliveryRuleIds: Record<string, number>;
  setDeliveryRuleId: (warehouse: string, ruleId: number) => void;
  /** Estimated total shipping fee shown on the checkout screen (pre-verification). */
  estimatedShippingFor: (warehouseCount: number) => number;
  /** Current stage in the request → verify → pay flow. */
  stage: CheckoutStage;
  setStage: (s: CheckoutStage) => void;
  orderId: string | null;
  setOrderId: (id: string | null) => void;
  /** Transaction codes from bulk order submission */
  transactionCodes: string[];
  setTransactionCodes: (codes: string[]) => void;
  /** Order totals from last submission (for verifikasi page) */
  orderTotals: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  } | null;
  setOrderTotals: (totals: { subtotal: number; shipping: number; discount: number; total: number }) => void;
  submitOrder: (warehouses: string[]) => string;
  markVerified: (warehouses: string[]) => void;
  /** Single item for Buy Now flow (bypasses cart). */
  buyNowItem: BuyNowItem | null;
  setBuyNowItem: (item: BuyNowItem | null) => void;
  clearBuyNowItem: () => void;
  /** Selected cart item IDs from cart (for cleanup after successful checkout) */
  selectedCartIds: string[];
  setSelectedCartIds: (ids: string[]) => void;
  clearSelectedCartIds: () => void;
  /** Per-warehouse calculated discount data from API */
  calculatedDiscounts: Record<string, {
    totalDiscount: number;
    lineDiscounts: Record<string, number>; // key: "productId_variantId", value: total discount for the line
  }>;
  setCalculatedDiscount: (warehouse: string, data: { totalDiscount: number; lineDiscounts: Record<string, number> }) => void;
  clearCalculatedDiscounts: () => void;
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
  const [vouchers, setVouchersState] = useState<Voucher[]>([]);
  const [payment, setPayment] = useState<PaymentMethod | null>(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [cod, setCod] = useState(false);
  const [groupShippingFees, setGroupShippingFees] = useState<Record<string, number>>({});
  const [deliveryRuleIds, setDeliveryRuleIds] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<CheckoutStage>("draft");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [transactionCodes, setTransactionCodesState] = useState<string[]>([]);
  const [orderTotals, setOrderTotalsState] = useState<{ subtotal: number; shipping: number; discount: number; total: number } | null>(null);
  const [buyNowItem, setBuyNowItemState] = useState<BuyNowItem | null>(null);
  const [selectedCartIds, setSelectedCartIdsState] = useState<string[]>([]);
  const [calculatedDiscounts, setCalculatedDiscountsState] = useState<Record<string, { totalDiscount: number; lineDiscounts: Record<string, number> }>>({});

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

  const setDeliveryRuleId = useCallback((wh: string, ruleId: number) => {
    setDeliveryRuleIds((s) => ({ ...s, [wh]: ruleId }));
  }, []);

  const setTransactionCodes = useCallback((codes: string[]) => {
    setTransactionCodesState(codes);
  }, []);

  const setOrderTotals = useCallback((totals: { subtotal: number; shipping: number; discount: number; total: number }) => {
    setOrderTotalsState(totals);
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

  const setSelectedCartIds = useCallback((ids: string[]) => {
    setSelectedCartIdsState(ids);
  }, []);

  const clearSelectedCartIds = useCallback(() => {
    setSelectedCartIdsState([]);
  }, []);

  const setCalculatedDiscount = useCallback((warehouse: string, data: { totalDiscount: number; lineDiscounts: Record<string, number> }) => {
    setCalculatedDiscountsState((s) => ({ ...s, [warehouse]: data }));
  }, []);

  const clearCalculatedDiscounts = useCallback(() => {
    setCalculatedDiscountsState({});
  }, []);

  const setVouchers = useCallback((v: Voucher[]) => {
    setVouchersState(v);
  }, []);

  const addVoucher = useCallback((v: Voucher) => {
    setVouchersState((prev) => {
      // Check if voucher already exists
      if (prev.some((vouch) => vouch.id === v.id)) {
        return prev;
      }
      return [...prev, v];
    });
  }, []);

  const removeVoucher = useCallback((voucherId: string) => {
    setVouchersState((prev) => prev.filter((v) => v.id !== voucherId));
  }, []);

  // Backward compatibility: single voucher methods
  const voucher = vouchers.length > 0 ? vouchers[0] : null;
  const setVoucher = useCallback((v: Voucher | null) => {
    if (v) {
      setVouchersState([v]);
    } else {
      setVouchersState([]);
    }
  }, []);

  const value = useMemo<CheckoutState>(() => ({
    mode, setMode, address, setAddress, warehouse, setWarehouse,
    vouchers, setVouchers, addVoucher, removeVoucher, voucher, setVoucher, payment, setPayment,
    notes, setNote, cod, setCod,
    groupShippingFees, setGroupShippingFee,
    deliveryRuleIds, setDeliveryRuleId,
    estimatedShippingFor: (n) => (mode === "dikirim" ? n * ESTIMATED_GROUP_SHIPPING_FEE * 2 : 0),
    stage, setStage, orderId, setOrderId,
    transactionCodes, setTransactionCodes,
    orderTotals, setOrderTotals,
    submitOrder, markVerified,
    buyNowItem, setBuyNowItem, clearBuyNowItem,
    selectedCartIds, setSelectedCartIds, clearSelectedCartIds,
    calculatedDiscounts, setCalculatedDiscount, clearCalculatedDiscounts,
  }), [mode, address, warehouse, vouchers, setVouchers, addVoucher, removeVoucher, voucher, setVoucher, payment, notes, setNote, cod, groupShippingFees, setGroupShippingFee, deliveryRuleIds, setDeliveryRuleId, stage, orderId, transactionCodes, setTransactionCodes, orderTotals, setOrderTotals, submitOrder, markVerified, buyNowItem, clearBuyNowItem, selectedCartIds, setSelectedCartIds, clearSelectedCartIds, calculatedDiscounts, setCalculatedDiscount, clearCalculatedDiscounts]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}
