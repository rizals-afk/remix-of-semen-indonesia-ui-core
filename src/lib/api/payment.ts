import { apiFetch } from "../api";

export interface CreatePaymentRequest {
  trx_id: number;
  customer_id: number;
  payment_method: string;
  payment_date: string;
  total: string;
  status: string;
  reference_id: string;
  reference_type: string;
  transaction_id?: string;
  gross_amount?: string;
  currency?: string;
  payment_type?: string;
  transaction_status?: string;
  fraud_status?: string;
  merchant_id?: string;
  va_number?: string;
  bank?: string;
  transaction_time?: string;
  settlement_time?: string;
  expiry_date?: string | null;
}

export interface PaymentResponse {
  id: number;
  trx_id: number;
  customer_id: number;
  payment_method: string;
  payment_date: string;
  total: string;
  status: string;
  reference_id: string;
  reference_type: string;
  created_at: string;
  updated_at: string;
}

export async function createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
  return apiFetch<PaymentResponse>("/payments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
