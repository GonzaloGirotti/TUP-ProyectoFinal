// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Carga las variables de .env según el modo (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  const apiUrl = env.VITE_API_URL || 'http://localhost:4000'
  console.log('🚀 Vite mode actual:', mode)

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
