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
			"@": path.resolve(__dirname, 'src'),
			'@foundation': path.resolve(__dirname, 'src/shared/ui/foundation'),
			'@components': path.resolve(__dirname, 'src/shared/ui/components'),
			'@ui': path.resolve(__dirname, 'src/shared/ui/index.ts'),
			'@widgets': path.resolve(__dirname, 'src/widgets'),
			'@features': path.resolve(__dirname, 'src/features'),
			'@shared': path.resolve(__dirname, 'src/shared'),
			'@entities': path.resolve(__dirname, 'src/entities'),
			'@app': path.resolve(__dirname, 'src/app'),
			'@pages': path.resolve(__dirname, 'src/pages')
		}
	}
})
