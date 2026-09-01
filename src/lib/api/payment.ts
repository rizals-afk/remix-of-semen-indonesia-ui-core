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
