import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference-only copy of the old Vite app, kept temporarily during
    // migration (see legacy-vite-app/README-MIGRATION.md). Not part of the
    // production build or lint surface.
    "legacy-vite-app/**",
  ]),
]);

export default eslintConfig;
