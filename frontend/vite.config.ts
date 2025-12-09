// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // Carga variables de entorno (.env, .env.development, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  const apiUrl = env.VITE_API_URL || 'http://localhost:4000'
  console.log('🚀 Vite mode actual:', mode)

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // --- ⚡ CONFIG TEST VITEST ---
    test: {
      globals: true,             // Permite describe, it, expect sin importar
      environment: 'jsdom',      // Necesario para testing de React
      setupFiles: './src/tests/setupTests.ts', // Archivo de setup
      css: true,                 // Permite cargar CSS en tests
      include: ['src/**/*.test.{ts,tsx}'], // Solo archivos test incluidos
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
      },
    },
  }
})
