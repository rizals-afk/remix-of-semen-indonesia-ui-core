import { apiFetch } from "../api";

export interface RegisterFcmTokenRequest {
  fcm_token: string;
}

export interface RegisterFcmTokenResponse {
  message: string;
}

export interface NotificationData {
  title: string;
  message: string;
  type: string;
  data: Record<string, unknown>;
}

export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationListResponse {
  current_page: number;
  data: Notification[];
  first_page_url: string | null;
  from: number;
  last_page: number;
  last_page_url: string | null;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface FetchNotificationsParams {
  page?: number;
  per_page?: number;
}

export interface UnreadCountResponse {
  count: number;
}

export async function registerFcmToken(fcmToken: string): Promise<RegisterFcmTokenResponse> {
  return apiFetch<RegisterFcmTokenResponse>("/notifications/register-fcm-token", {
    method: "POST",
    body: JSON.stringify({ fcm_token: fcmToken }),
  });
}

export async function fetchNotifications(params?: FetchNotificationsParams): Promise<NotificationListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
  const queryString = queryParams.toString();
  const url = queryString ? `/notifications?${queryString}` : "/notifications";
  return apiFetch<NotificationListResponse>(url);
}

export async function markAsRead(notificationId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/notifications/${notificationId}/mark-as-read`, {
    method: "POST",
  });
}

export async function getUnreadCount(): Promise<UnreadCountResponse> {
  return apiFetch<UnreadCountResponse>("/notifications/unread-count");
}
