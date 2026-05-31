import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const config = [
  {
    ignores: [
      "dist/",
      "build/",
      "coverage/",
      "node_modules/",
      "temp/",
      "OLD/",
      "docs/",
      "DEV/"
    ]
  },
  js.configs.recommended
].concat(tseslint.configs.strictTypeChecked, [
  {
    files: ["src/**/*.ts", "*.config.ts"],
    languageOptions: {
      globals: Object.assign({}, globals.browser, globals.node),
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
]);

export default tseslint.config(config);
