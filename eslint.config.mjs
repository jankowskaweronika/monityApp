import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),

  {
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "no-trailing-spaces": "error",
      "space-infix-ops": "error",
      "object-curly-spacing": ["error", "always"],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;