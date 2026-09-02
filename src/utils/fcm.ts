// Firebase is client-only, so we need to import it dynamically
let FirebaseApp: any = null;
let Messaging: any = null;
let MessagePayload: any = null;

let app: any = null;
let messaging: any = null;
let firebaseLoadError: boolean = false;

async function loadFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (firebaseLoadError) {
    return null;
  }

  if (!FirebaseApp) {
    try {
      const firebase = await import('firebase/app') as any;
      const messagingModule = await import('firebase/messaging') as any;
      FirebaseApp = firebase.initializeApp;
      FirebaseApp.getApps = firebase.getApps;
      Messaging = messagingModule.getMessaging;
      MessagePayload = messagingModule.MessagePayload;
      messagingModule.getToken;
      messagingModule.onMessage;
    } catch (error) {
      console.error('Failed to load Firebase:', error);
      firebaseLoadError = true;
      return null;
    }
  }

  return { FirebaseApp, Messaging, MessagePayload };
}

// Firebase configuration - replace with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export async function initializeFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }

  const firebase = await loadFirebase();
  if (!firebase) {
    return null;
  }

  if (!app) {
    app = firebase.FirebaseApp.getApps().length === 0
      ? firebase.FirebaseApp.initializeApp(firebaseConfig)
      : firebase.FirebaseApp.getApps()[0];
  }
  return app;
}

export async function getMessagingInstance() {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!messaging) {
      const firebase = await loadFirebase();
      if (!firebase) {
        return null;
      }

      const firebaseApp = await initializeFirebase();
      if (!firebaseApp) {
        return null;
      }

      messaging = firebase.Messaging(firebaseApp);
    }
    return messaging;
  } catch (error) {
    console.error('Failed to get messaging instance:', error);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export async function getFcmToken(): Promise<string | null> {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      console.error('Messaging not initialized');
      return null;
    }

    const permission = await requestNotificationPermission();
    if (!permission) {
      console.log('Notification permission not granted');
      return null;
    }

    const { getToken } = await import('firebase/messaging');
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

export async function onForegroundMessage(callback: (payload: any) => void): Promise<() => void> {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const messagingInstance = await getMessagingInstance();
  if (!messagingInstance) {
    console.error('Messaging not initialized');
    return () => {};
  }

  const { onMessage } = await import('firebase/messaging');
  return onMessage(messagingInstance, callback);
}
