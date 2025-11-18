import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'AVECapstone';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? '/' : `/${repoName}/`,
  plugins: [react()],
});
