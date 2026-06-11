import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Kỷ luật component layer: app/feature code KHÔNG import shadcn primitives
  // trực tiếp. Chỉ được dùng qua tầng design system (@/components/core).
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/ui", "@/components/ui/*"],
              message:
                "Không import shadcn primitives trực tiếp. Dùng qua @/components/core (xem CLAUDE.md, Luật vàng #3).",
            },
          ],
        },
      ],
    },
  },
  // Ngoại lệ: chính tầng ui (vendor) và tầng core (gateway) được phép.
  {
    files: ["components/ui/**", "components/core/**"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
