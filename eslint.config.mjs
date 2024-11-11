import globals from "globals";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import typescript from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/*", ".vite/*", "out/*", "docs/.vitepress/cache/*"],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    ignores: ["**/*.d.ts", "docs/cache/**/*"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        project: false,
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: "./",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      "quotes": [2, "double", { "avoidEscape": true }],
      "no-undef": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "semi": [2, "always"],
    },
  },
  {
    files: ["**/*.{js,jsx,mjs}"],
    rules: {
      "no-unused-vars": "error",
    }
  },
  {
    files: ["**/*.{ts,tsx,mts,cts,vue}"],
    ignores: ["**/*.d.ts"],
    plugins: {
      "@typescript-eslint": typescript.plugin,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["error", {"caughtErrors": "none",}],
    },
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        project: false,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  }
];
