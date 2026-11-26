import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:process.env.VITE_BASE_PATH||'/',plugins:[react()],server:{proxy:{'/api':'http://localhost:5001','/uploads':'http://localhost:5001'}},test:{environment:'jsdom',setupFiles:'./src/test-setup.js',include:['src/**/*.test.jsx']}});
