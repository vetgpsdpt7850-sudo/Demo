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
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/gps': {
          target: 'https://shareapi.adsun.vn',
          changeOrigin: true,
          secure: false,
          rewrite: (pathStr) => {
            const queryIndex = pathStr.indexOf('?');
            const queryString = queryIndex >= 0 ? pathStr.substring(queryIndex) : '?pageIds=6208&username=vetadmin&pwd=12345';
            return `/Vehicle/GpsInfos${queryString}`;
          },
        },
      },
    },
  };
});
