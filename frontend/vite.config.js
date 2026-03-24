import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'vendor-charts';
            }
            if (id.includes('@heroicons')) {
              return 'vendor-icons';
            }
            if (id.includes('react-markdown')) {
              return 'vendor-markdown';
            }
            // Group remaining small vendors into a single vendor chunk
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500, // Increase limit to 1500kb
  }
})
