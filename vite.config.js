import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Optional: If you need a specific base path for your app (e.g., deployed under a subfolder)
  // base: '/your-subfolder/',

  build: {
    outDir: 'dist',  // Ensure Vite is using the 'dist' folder for production output
  },
  
  // If you are using any specific server-side routing or path rewriting in development
  // you can add a base path to ensure consistency between dev and prod environments
})
