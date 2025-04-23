import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 하나의 export default만 사용
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8081', // 백엔드 프록시 설정
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "antd/dist/antd.css";', // Ant Design CSS 추가
      },
    },
  },
});
