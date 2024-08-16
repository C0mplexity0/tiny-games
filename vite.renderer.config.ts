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
      outDir: `.vite/renderer/${name}`,
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
      },
    },
    optimizeDeps: {
      exclude: ["js-big-decimal"]
    },
    clearScreen: false,
  } as UserConfig;
});
