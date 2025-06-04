import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [tailwindcss(), reactRouter(), cloudflare({ viteEnvironment: { name: 'ssr' } }), tsconfigPaths()],
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			'@': '/src',
		},
	}
});
