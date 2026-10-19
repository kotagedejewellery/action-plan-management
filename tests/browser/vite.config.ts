import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  envDir: false,
  resolve: { alias: { "@": fileURLToPath(new URL("../../src", import.meta.url)) } },
  define: { "process.env": {} },
  esbuild: { jsx: "automatic" },
  server: { host: "127.0.0.1", port: 4175, strictPort: true },
});
