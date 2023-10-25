import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), ViteImageOptimizer()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
            "#root/*": resolve(__dirname),
        },
    },
});
