import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        // @noble/curves v2 removed the ./secp256k1 subpath from its exports map,
        // but secp256k1.js still ships. Wallet-adapter deps (keystone/bip32) still
        // import '@noble/curves/secp256k1', so remap it explicitly.
        '@noble/curves/secp256k1': path.resolve(__dirname, 'node_modules/@noble/curves/secp256k1.js'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});