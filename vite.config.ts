import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** ensures compatibility with the `file://` protocol */
function fileProtocol(): Plugin {
  return {
    name: 'file-protocol-compatibility',
    transformIndexHtml(html) {
      return html
        .replace('type="module"', 'defer')
        .replaceAll(' crossorigin ', ' ');
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env['offline'] === 'true' ? [fileProtocol()] : []),
  ],
  base: './', // since assets are hosted relative to index.html, keep them relative to it
});
