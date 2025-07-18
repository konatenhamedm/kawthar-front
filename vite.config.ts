import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	/* server: {
		proxy: {
			'/api': {
				target: 'https://back.kawthar-expertise.com',
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, '/api')
			}
		}
	}, */
	/* build: {
		rollupOptions: {
		  external: ['cookie'] // ← éviter de le bundler
		}
	  } */
});
