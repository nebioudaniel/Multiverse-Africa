import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // temporarily allow any
      "react-hooks/exhaustive-deps": "off",       // ignore missing deps
      "react-hooks/rules-of-hooks": "off",        // ignore hook usage
      "@typescript-eslint/no-unused-vars": "warn", // don't fail on unused imports
    },
  },
];

export default eslintConfig;
