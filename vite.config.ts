
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Lắng nghe trên tất cả các địa chỉ IP (cần thiết cho ngrok/docker/network)
    host: true, 
    // Cho phép tất cả các host để tránh lỗi "Blocked request" khi dùng ngrok
    allowedHosts: true, 
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin-app/index.html',
      },
    },
  },
});
