import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
          'vendor-html2canvas': ['html2canvas']
        }
      }
    },
    // 使用esbuild压缩（更快，Netlify兼容性更好）
    minify: 'esbuild',
    // 启用CSS代码分割
    cssCodeSplit: true,
    // chunk大小警告阈值
    chunkSizeWarningLimit: 600
  }
})
