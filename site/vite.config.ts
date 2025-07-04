import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

console.log('vite.config.ts is loaded'); // 调试输出

export default defineConfig({
plugins: [vue()],
resolve: {
    alias: {
    '@': path.resolve(__dirname, './src'),
    },
},
define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
},
});