import json from "@eslint/json";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { ignores: ["**/*.js", "**/*.cjs", "**/*.mjs"] },
  { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
]);