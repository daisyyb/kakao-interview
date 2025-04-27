import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8081',
      '/sk-api': {
        target: 'https://apis.openapi.sk.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sk-api/, ''),
        secure: true,  // 보안 인증 활성화
      },
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "antd/dist/antd.css";',
      },
    },
  },
});
