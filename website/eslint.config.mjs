import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

const britishWordPattern = "(?<!-)\\b(?:favorite|behavior|center)\\b";
const coreWebVitalsRules = {
    ...nextPlugin.configs['core-web-vitals'].rules,
};

delete coreWebVitalsRules['react-hooks/rules-of-hooks'];
delete coreWebVitalsRules['react-hooks/exhaustive-deps'];

export default [
    {
        ignores: [
            'node_modules/**',
            '.next/**',
            'out/**',
            'build/**',
            'next-env.d.ts',
            'eslint.config.mjs',
        ],
    },
    js.configs.recommended,
    {
        name: '@next/next/core-web-vitals',
        files: ['**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            '@next/next': nextPlugin,
            react: reactPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...coreWebVitalsRules,
            'react/jsx-uses-vars': 'warn',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'no-restricted-syntax': [
                'warn',
                {
                    selector: `Literal[value=/${britishWordPattern}/i]`,
                    message: 'Use British spelling (e.g. colour, favourite, centre, behaviour).',
                },
                {
                    selector: `TemplateElement[value.raw=/${britishWordPattern}/i]`,
                    message: 'Use British spelling (e.g. colour, favourite, centre, behaviour).',
                },
            ],
        },
    },
];
