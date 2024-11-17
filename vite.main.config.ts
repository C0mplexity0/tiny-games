import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, mergeConfig } from "vite";
import { getBuildConfig, getBuildDefine, external, pluginHotRestart } from "./vite.base.config";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import path from "path";

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"build">;
  const { forgeConfigSelf } = forgeEnv;
  const define = getBuildDefine(forgeEnv);
  const config: UserConfig = {
    build: {
      lib: {
        entry: forgeConfigSelf.entry!,
        fileName: () => "[name].js",
        formats: ["cjs"],
      },
      rollupOptions: {
        external,
      },
    },
    plugins: [pluginHotRestart("restart"), react()],
    define,
    resolve: {
      // Load the Node.js entry.
      mainFields: ["module", "jsnext:main", "jsnext"],
      alias: {
        "@app": path.resolve(__dirname, "src/ui/app"),
        "@web": path.resolve(__dirname, "src/ui/web"),
        "@lib": path.resolve(__dirname, "src/ui/lib"),
        "@styles": path.resolve(__dirname, "src/ui/styles"),
        "@components": path.resolve(__dirname, "src/ui/components"),
        "@hooks": path.resolve(__dirname, "src/ui/hooks"),
        "@": path.resolve(__dirname, "src"),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    publicDir: "src/ui/assets"
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
