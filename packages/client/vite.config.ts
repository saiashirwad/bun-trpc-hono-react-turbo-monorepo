import { resolve } from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	root: __dirname,
	resolve: {
		alias: {
			types: resolve(__dirname, "../types/index.ts"),
		},
	},
	server: {
		port: 5173,
		proxy: {
			"/trpc": {
				target: "http://localhost:3000",
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: "./dist",
		emptyOutDir: true,
		assetsDir: "assets",
	},
});
