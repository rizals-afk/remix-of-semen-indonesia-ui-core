import { apiFetch } from "../api";

export interface DeliveryRule {
  id: number;
  code: string;
  tonase_min: string;
  tonase_max: string;
  distance_min: string;
  distance_max: string;
  delivery_price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  date_available_from: string;
  date_available_to: string;
  shipto: string;
}

export interface CheckDeliveryRequest {
  customer_lat: number;
  customer_long: number;
  branch_lat: number;
  branch_long: number;
  tonase: number;
}

export interface CheckDeliveryResponse {
  delivery_rule: DeliveryRule;
  distance: number;
  tonase: number;
}

export async function checkDelivery(request: CheckDeliveryRequest): Promise<CheckDeliveryResponse> {
  return apiFetch<CheckDeliveryResponse>("/delivery-rules/check_delivery", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
