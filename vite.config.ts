import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
		  '/api': {
			target: 'https://back.kawthar-expertise.com',
			changeOrigin: true,
			secure: false, // Désactiver si le certificat SSL est auto-signé
			rewrite: (path) => path.replace(/^\/api/, '/api') // Garde le préfixe
		  }
		}
	  },
	
	build: {
		rollupOptions: {
		  external: ['cookie'] // ← éviter de le bundler
		}
	  }
});
