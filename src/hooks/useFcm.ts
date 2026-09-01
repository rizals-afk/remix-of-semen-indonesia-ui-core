import { useEffect, useState } from 'react';
import { getFcmToken, onForegroundMessage } from '@/utils/fcm';
import { registerFcmToken } from '@/lib/api/notification';
import { getToken } from '@/lib/auth';
import { toast } from 'sonner';

export function useFcm() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const initializeFcm = async () => {
      try {
        const token = await getFcmToken();
        if (token) {
          setFcmToken(token);
          console.log('FCM token obtained:', token);

          // Register token with backend if user is authenticated
          const authToken = getToken();
          if (authToken) {
            await registerFcmToken(token);
            setIsRegistered(true);
            console.log('FCM token registered with backend');
          }
        }
      } catch (error) {
        console.error('Failed to initialize FCM:', error);
      }
    };

    initializeFcm();

    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      console.log('Foreground message received:', payload);
      toast.info(payload.notification?.title || 'New notification', {
        description: payload.notification?.body,
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const registerToken = async () => {
    if (!fcmToken) {
      const token = await getFcmToken();
      if (token) {
        setFcmToken(token);
      }
    }

    if (fcmToken) {
      try {
        await registerFcmToken(fcmToken);
        setIsRegistered(true);
        toast.success('Notifikasi berhasil diaktifkan');
      } catch (error) {
        console.error('Failed to register FCM token:', error);
        toast.error('Gagal mengaktifkan notifikasi');
      }
    }
  };

  return {
    fcmToken,
    isRegistered,
    registerToken,
  };
}
