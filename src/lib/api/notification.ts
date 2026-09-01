import { apiFetch } from "../api";

export interface RegisterFcmTokenRequest {
  fcm_token: string;
}

export interface RegisterFcmTokenResponse {
  message: string;
}

export async function registerFcmToken(fcmToken: string): Promise<RegisterFcmTokenResponse> {
  return apiFetch<RegisterFcmTokenResponse>("/notifications/register-fcm-token", {
    method: "POST",
    body: JSON.stringify({ fcm_token: fcmToken }),
  });
}
