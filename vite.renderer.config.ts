import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config";
import path from "path";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"renderer">;
  const { mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  return {
    root: `./src/ui/${name}`,
    mode,
    base: "./",
    build: {
      outDir: `../../../.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name)
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@app": path.resolve(__dirname, "src/ui/app"),
        "@web": path.resolve(__dirname, "src/ui/web"),
        "@lib": path.resolve(__dirname, "src/ui/lib"),
        "@styles": path.resolve(__dirname, "src/ui/styles"),
        "@components": path.resolve(__dirname, "src/ui/components"),
        "@": path.resolve(__dirname, "src"),
      },
    },
    optimizeDeps: {
      exclude: ["js-big-decimal"],
      // Forces vite to ignore existing cache (in node_modules/.vite) and rebuild the project anyway. This seems to fix the 504 (Outdated Optimize Dep) error, which could be caused by the fact that there are two instances of vite running side-by-side (app & web in forge.config.ts). 
      force: true
    },
    clearScreen: false,
    server: {
      host: "0.0.0.0",
      port: name == "web" ? 8976 : 8977,
      watch: {
        ignored: "src/ui"
      }
    }
  } as UserConfig;
});
