import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8787',
            changeOrigin: true
          }
        }
      },
      plugins: [react()],
      build: {
        target: 'esnext',
        minify: 'esbuild',
        cssCodeSplit: true,
        sourcemap: false,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'charts': ['recharts'],
              'motion': ['framer-motion'],
              'icons': ['lucide-react']
            },
            assetFileNames: (assetInfo) => {
              const info = assetInfo.name?.split('.');
              const ext = info?.[info.length - 1];
              if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
                return `assets/images/[name]-[hash][extname]`;
              }
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
                return `assets/fonts/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            }
          }
        },
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info']
          }
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      assetsInclude: ['**/*.webp', '**/*.webm'],
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : []
      }
    };
});
