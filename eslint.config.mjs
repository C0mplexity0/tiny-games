import globals from "globals";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import typescript from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/*", ".vite/*", "out/*"],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    ignores: ["**/*.d.ts"],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        ecmaFeatures: {
          jsx: true,
        },
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
    files: ["**/*.{ts,tsx,mts,cts}"],
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
        project: true,
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
