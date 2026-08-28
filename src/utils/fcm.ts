import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';

// Firebase configuration - replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

export function initializeFirebase(): FirebaseApp {
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export function getMessagingInstance(): Messaging | null {
  try {
    if (!messaging) {
      const firebaseApp = initializeFirebase();
      messaging = getMessaging(firebaseApp);
    }
    return messaging;
  } catch (error) {
    console.error('Failed to get messaging instance:', error);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const messagingInstance = getMessagingInstance();
    if (!messagingInstance) {
      console.error('Messaging not initialized');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log('Notification permission not granted');
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || '',
    });

    if (!token) {
      console.log('No FCM token available');
      return null;
    }

    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

export function onForegroundMessage(callback: (payload: MessagePayload) => void): () => void {
  const messagingInstance = getMessagingInstance();
  if (!messagingInstance) {
    console.error('Messaging not initialized');
    return () => {};
  }

  return onMessage(messagingInstance, callback);
}
