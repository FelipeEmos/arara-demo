const typescriptParser = require("@typescript-eslint/parser");
const typescriptEslintPlugin = require("@typescript-eslint/eslint-plugin");
const solidEslintPlugin = require("eslint-plugin-solid");
const prettier = require("eslint-plugin-prettier");
const js = require("@eslint/js");

/** @type {import("eslint").Linter.Config} */
const config = {
  ...js.configs.recommended,

  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      sourceType: "module",
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: {
    solid: solidEslintPlugin,
    "@typescript-eslint": typescriptEslintPlugin,
    prettier: prettier,
  },
  rules: {
    ...solidEslintPlugin.configs.typescript.rules,
    ...prettier.configs.recommended.rules,
    "solid/reactivity": "warn",
    "solid/no-destructure": "warn",
    "solid/jsx-no-undef": "error",
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
  files: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.js",
    "src/**/*.jsx",
    "src/**/*.cjs",
    "src/**/*.mjs",
  ],
};

module.exports = config;
