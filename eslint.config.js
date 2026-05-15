import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  { ignores: ["**/dist/**", "**/.next/**", "**/target/**", "**/node_modules/**"] },
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  prettier,
);
