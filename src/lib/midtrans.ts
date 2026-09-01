let snapLoaded = false;
let snapLoadPromise: Promise<void> | null = null;

export function loadMidtransSnap(): Promise<void> {
  if (snapLoaded) {
    return Promise.resolve();
  }

  if (snapLoadPromise) {
    return snapLoadPromise;
  }

  snapLoadPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Midtrans Snap can only be loaded in the browser'));
      return;
    }

    const script = document.createElement('script');
    // Use proxied URL to avoid CORS issues in development
    script.src = '/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-'); // Client key will be set by the backend
    script.onload = () => {
      console.log('Midtrans Snap SDK loaded successfully');
      snapLoaded = true;

      // Verify snap is available
      if (typeof (window as any).snap === 'undefined') {
        console.error('Snap SDK loaded but window.snap is not available');
        reject(new Error('Snap SDK loaded but window.snap is not available'));
        return;
      }

      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Midtrans Snap SDK script');
      snapLoadPromise = null;
      reject(new Error('Failed to load Midtrans Snap SDK'));
    };
    document.head.appendChild(script);
  });

  return snapLoadPromise;
}

export function isSnapLoaded(): boolean {
  return snapLoaded && typeof window !== 'undefined' && typeof (window as any).snap !== 'undefined';
}
