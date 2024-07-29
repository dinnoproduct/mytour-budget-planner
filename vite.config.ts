import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		sourcemap: true
	},
	css: {
		modules: {
			localsConvention: 'camelCase',
			generateScopedName: '[local]_[hash:base64:2]'
		}
	},
	resolve: {
		alias: {
			'@foundation': path.resolve(__dirname, 'src/shared/ui/foundation'),
			'@ui': path.resolve(__dirname, 'src/shared/ui/index.ts')
		}
	}
})
