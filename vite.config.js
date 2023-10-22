import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		outDir: "api",
		lib: {
			// 複数のエントリーポイントのディクショナリや配列にもできます
			entry: resolve(__dirname, 'src/notify.ts'),
			name: 'MyLib',
			// 適切な拡張子が追加されます
			fileName: 'notify',
			formats: ["cjs"]
		},
		rollupOptions: {
		},
	},
})
