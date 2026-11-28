// Client-side app configuration (safe to ship to the browser — no secrets).

export const config = {
  midtrans: {
    snapUrl: {
      production: "https://app.midtrans.com/snap/snap.js",
      sandbox: "https://app.sandbox.midtrans.com/snap/snap.js",
    },
  },
} as const;
