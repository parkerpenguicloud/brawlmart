import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'  // Add this import for path resolution

export default defineConfig({
  logLevel: 'error', // Keep your original setting
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // This makes @/ point to src/
    },
  },
})