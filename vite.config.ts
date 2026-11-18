import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// base: './' — збірка працює з будь-якої підпапки (GitHub Pages, шкільний сервер)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Безпечний квест',
        short_name: 'Безпечний квест',
        description: 'Квести з безпеки для шкіл НУШ',
        lang: 'uk',
        theme_color: '#ffc531',
        background_color: '#f3f7ff',
        display: 'standalone',
        start_url: './',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
});
