// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      allowedHosts: ['f2b6-182-8-100-75.ngrok-free.app', 
        '73ac-182-8-99-17.ngrok-free.app', 
        'cbfb-157-20-239-217.ngrok-free.app', 
        'c1a8-157-20-239-165.ngrok-free.app',
        'a5ce-157-20-239-165.ngrok-free.app',
        '2d4gssn7-8081.asse.devtunnels.ms'
      ],
      proxy: {
        '/api': {
          target: 'https://2d4gssn7-8000.asse.devtunnels.ms',
          changeOrigin: true,
        },
      },
    },
  },
});
