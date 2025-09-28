import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const britishWordPattern = "(?<!-)\\b(?:favorite|behavior|center)\\b";

const eslintConfig = [
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            "eslint.config.mjs",
        ],
    },
    ...compat.extends("next/core-web-vitals"),
    {
        rules: {
            "no-restricted-syntax": [
                "warn",
                {
                    selector: `Literal[value=/${britishWordPattern}/i]`,
                    message: "Use British spelling (e.g. colour, favourite, centre, behaviour).",
                },
                {
                    selector: `TemplateElement[value.raw=/${britishWordPattern}/i]`,
                    message: "Use British spelling (e.g. colour, favourite, centre, behaviour).",
                },
            ],
        },
    },
];

export default eslintConfig;
