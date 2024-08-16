import globals from "globals";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import typescript from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/*", ".vite/*", "out/*"],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    ignores: ["**/*.d.ts"],
    plugins: {
      react,
      "@typescript-eslint": typescript.plugin,
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
    rules: {
      ...eslint.configs.recommended.rules,
      "quotes": "error",
      "no-undef": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
     },
  },
];
