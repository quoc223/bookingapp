import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // vite config
    define: {
      // Truyền toàn bộ biến môi trường vào ứng dụng
      __DOMAINNAME__: JSON.stringify(env.VITE_DOMAINNAME),
      __API_PROVINCE__: JSON.stringify(env.VITE_API_PROVINCE),
      __API_DISTRICT__: JSON.stringify(env.VITE_API_DISTRICT),
      __API_WARD__: JSON.stringify(env.VITE_API_WARD),
    },
    plugins: [react()]



  };
});
