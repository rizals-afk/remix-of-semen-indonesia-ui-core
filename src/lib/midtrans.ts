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
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'SB-Mid-client-'); // Client key will be set by the backend
    script.onload = () => {
      snapLoaded = true;
      resolve();
    };
    script.onerror = () => {
      snapLoadPromise = null;
      reject(new Error('Failed to load Midtrans Snap SDK'));
    };
    document.body.appendChild(script);
  });

  return snapLoadPromise;
}

export function isSnapLoaded(): boolean {
  return snapLoaded && typeof window !== 'undefined' && typeof (window as any).snap !== 'undefined';
}
