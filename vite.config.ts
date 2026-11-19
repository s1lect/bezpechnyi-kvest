import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/** Додає <link rel="preload"> для шрифтів першого екрана, щоб текст не «стрибав» після їх завантаження. */
function preloadFonts(patterns: RegExp[]): Plugin {
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((f) => patterns.some((re) => re.test(f)));
      return {
        html,
        tags: files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `./${f}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head' as const,
        })),
      };
    },
  };
}

// base: './' — збірка працює з будь-якої підпапки (GitHub Pages, шкільний сервер)
export default defineConfig({
  base: './',
  plugins: [
    react(),
    preloadFonts([/unbounded-cyrillic-(700|800)-normal-.*\.woff2$/, /onest-cyrillic-wght-normal-.*\.woff2$/]),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Безпечний квест',
        short_name: 'Безпечний квест',
        description: 'Квести з безпеки для шкіл НУШ',
        lang: 'uk',
        theme_color: '#ffc531',
        background_color: '#f3f7ff',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,webp}'],
        globIgnores: ['og-image.png'],
      },
    }),
  ],
});
