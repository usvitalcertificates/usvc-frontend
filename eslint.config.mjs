import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

// NOTE: eslint-config-next is not used — its bundled typescript-eslint crashes
// on TypeScript 7. Next.js rule coverage is intentionally minimal here; type
// safety is enforced by `tsc --noEmit` in the pre-commit hook instead.
export default [
  { ignores: [".next/", "node_modules/", "public/geo/"] },
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  prettier,
];
