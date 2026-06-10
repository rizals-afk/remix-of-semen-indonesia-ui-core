import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ADDRESSES, PAYMENT_METHODS, VOUCHERS, WAREHOUSES, type Address, type PaymentMethod, type Voucher, type Warehouse } from "@/data/shopping";

export type FulfillmentMode = "dikirim" | "diambil";

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
  notes: string;
  setNotes: (s: string) => void;
  shippingFee: number;
}

const CheckoutContext = createContext<CheckoutState | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<FulfillmentMode>("dikirim");
  const [address, setAddress] = useState<Address>(ADDRESSES[0]);
  const [warehouse, setWarehouse] = useState<Warehouse>(WAREHOUSES[0]);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [payment, setPayment] = useState<PaymentMethod | null>(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState("");

  const value = useMemo<CheckoutState>(() => ({
    mode, setMode, address, setAddress, warehouse, setWarehouse,
    voucher, setVoucher, payment, setPayment, notes, setNotes,
    shippingFee: mode === "dikirim" ? 75000 : 0,
  }), [mode, address, warehouse, voucher, payment, notes]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used inside CheckoutProvider");
  return ctx;
}
