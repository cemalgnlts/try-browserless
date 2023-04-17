import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	worker: {
		format: "es"
	},
	resolve: {
		alias: {
			"dns": fileURLToPath(new URL("src/libs/dns.js", import.meta.url))
		}
	},
	server: {
		port: parseInt(process.env.PORT) || 5173
	}
});
